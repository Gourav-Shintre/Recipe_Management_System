using Epam.Recipe.Application.Services;
using Epam.Recipe.Data;
using Epam.Recipe.Data.Repository;
using Epm.Recipe.API.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .ToDictionary(
                    e => e.Key,
                    e => e.Value.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            var err_cust = new List<string>();
            foreach (string k in errors.Keys)
            {
                foreach (string i in errors[k])
                {
                    err_cust.Add(i);
                }
            }

            var result = new
            {
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                path = context.HttpContext.Request.Path.Value,
                message = err_cust
            };

            return new BadRequestObjectResult(result);
        };
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IRecipeService, RecipeService>();
// Add MVC services
builder.Services.AddControllers();
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
builder.Services.AddDbContext<RecipeDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"]))
    };
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<RecipeDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseMiddleware<ExceptionMiddleware>();

app.Use(async (context, next) =>
{
    // Check that the request is targeted at the specific endpoint that expects JSON
    if (context.Request.Path.StartsWithSegments("/api/Recipe") &&
        context.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase))
    {
        if (!context.Request.ContentType.Contains("application/json"))
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 415; // Unsupported Media Type
            var errorResponse = new
            {
                timestamp = DateTime.UtcNow.ToString("o"),
                path = context.Request.Path.ToString(),
                message = "Invalid Content-Type. Please ensure the content type of the request is 'application/json'."
            };
            await context.Response.WriteAsJsonAsync(errorResponse);
            return;
        }
    }

    await next.Invoke();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.Run();
