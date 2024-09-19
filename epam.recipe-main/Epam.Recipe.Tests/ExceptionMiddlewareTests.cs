using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using Epm.Recipe.API.Middlewares;

namespace Epam.Recipe.Tests
{
    public class ExceptionMiddlewareTests
    {
        private readonly RequestDelegate _next;
        private readonly DefaultHttpContext _context; // Using DefaultHttpContext instead of Mock<HttpContext>

        public ExceptionMiddlewareTests()
        {
            _next = (innerHttpContext) =>
            {
                throw new Exception("Test exception");
            };

            _context = new DefaultHttpContext(); // Create a full HTTP context
            _context.Request.Path = new PathString("/test-path"); // Set the request path
            _context.Response.Body = new MemoryStream(); // Set the response body to a writeable stream
        }

        [Fact]
        public async Task InvokeAsync_CatchesException_UpdatesResponse()
        {
            var middleware = new ExceptionMiddleware(_next); // Middleware instance
            await middleware.InvokeAsync(_context); // Use the initialized DefaultHttpContext

            _context.Response.Body.Seek(0, SeekOrigin.Begin); // Reset stream position
            using (var reader = new StreamReader(_context.Response.Body))
            {
                var body = await reader.ReadToEndAsync();
                dynamic obj = JsonConvert.DeserializeObject(body);

                // Assert
                Assert.Equal((int)HttpStatusCode.InternalServerError, _context.Response.StatusCode);
                Assert.Equal("application/json", _context.Response.ContentType);
                Assert.Equal("Test exception", (string)obj.Message);
                Assert.Equal("/test-path", (string)obj.path);
                Assert.Equal(_context.Response.StatusCode, (int)obj.StatusCode);
            }
        }
    }
}