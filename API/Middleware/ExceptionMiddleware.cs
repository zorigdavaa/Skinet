using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger _logger;
        public ExceptionMiddleware(RequestDelegate next, IWebHostEnvironment env, ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
            _env = env;
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,ex.Message);
                context.Response.ContentType="application/json";
                context.Response.StatusCode=(int) HttpStatusCode.InternalServerError;
                var response=_env.IsDevelopment() ? new ApiException((int) HttpStatusCode.InternalServerError,ex.Message,ex.StackTrace.ToString())
                                                  : new ApiException((int) HttpStatusCode.InternalServerError);
                var options = new JsonSerializerOptions{
                    PropertyNamingPolicy=JsonNamingPolicy.CamelCase
                };
                
                var json= JsonSerializer.Serialize(response,options);
                await context.Response.WriteAsync(json);
            }
        }



    }
}