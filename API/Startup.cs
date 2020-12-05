using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using API.Helper;
using API.Middleware;
using AutoMapper;
using Core.Interfaces;
using InfraStructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using API.Extensions;
using StackExchange.Redis;
using InfraStructure.Identity;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration configuration)
        {
            _config = configuration;

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddApplicationServices();
            services.AddIdentityServices(_config);
            services.AddDbContextPool<StoreContext>(x =>
                x.UseSqlite(_config.GetConnectionString("DefaultConnection")));
            services.AddDbContextPool<AppIdentityDBContext>(x=> {
                x.UseSqlite(_config.GetConnectionString("IdentityConnection"));
            });
            services.AddSingleton<IConnectionMultiplexer>(c => {
                var configuration = ConfigurationOptions.Parse(
                    _config.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(configuration);
            });
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddLogging(config=>{
                config.AddConsole();
                config.AddDebug();
                
            });
            services.AddSwaggerDocumentation();
            services.AddSwaggerGen(c=>{
                c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First ());
            });
            services.AddCors(opt=>
            {
                opt.AddPolicy("CorsPolicy",policy=>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // if (env.IsDevelopment())
            // {
            //     app.UseDeveloperExceptionPage();
            // }
            //Exceoption Middleware will handle exceptions
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseHttpsRedirection();
            
            app.UseStatusCodePagesWithReExecute("/error/{0}");
            app.UseRouting();
            app.UseStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseSwaggerDocumentation();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
