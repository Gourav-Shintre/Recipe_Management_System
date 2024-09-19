using Epam.Recipe.AuthorizationService.API.Middlewares;
using Epam.Recipe.AuthorizationService.Application;
using Epam.Recipe.AuthorizationService.Application.Service;
using Epam.Recipe.AuthorizationService.Data;
using Epam.Recipe.AuthorizationService.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value.Errors.Count > 0)
            .Select(e => e.Value.Errors.Select(x => x.ErrorMessage))
            .SelectMany(x => x)
            .ToList();

        var result = new
        {
            timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            path = context.HttpContext.Request.Path.Value,
            message = errors
        };

        return new BadRequestObjectResult(result);
    };
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Application Services
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();
builder.Services.AddScoped<RegistrationValidator>();
builder.Services.AddScoped<ILoginService, LoginService>();

// Register Repositories
builder.Services.AddScoped<IAuthorizationRepository, AuthorizationRepository>();

// Configure Entity Framework Core with a sample in-memory database (replace with your actual database configuration)
builder.Services.AddDbContext<AuthorizationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AuthorizationDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseMiddleware<ExceptionMiddleware>();

app.Use(async (context, next) =>
{
    // Check that the request is targeted at the specific endpoint that expects JSON
    if (context.Request.Path.StartsWithSegments("/api/login") &&
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


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.Run();
