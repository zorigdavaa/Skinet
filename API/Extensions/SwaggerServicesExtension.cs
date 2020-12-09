using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace API.Extensions
{
    public static class SwaggerServicesExtension
    {
        public static IServiceCollection
        AddSwaggerDocumentation(this IServiceCollection services)
        {
            services
                .AddSwaggerGen(c =>
                {
                    c
                        .SwaggerDoc("v1",
                        new OpenApiInfo {
                            Title = "SkiNet Api",
                            Version = "v1"
                        });
                    var securiitySchema = new OpenApiSecurityScheme
                    {
                        Description = "JWT Bearer schema",
                        Name="Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = "bearer",
                        BearerFormat="JWT",
                        Reference = new OpenApiReference 
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "bearer"
                        }
                    };
                    c.AddSecurityDefinition(securiitySchema.Reference.Id,securiitySchema);
                    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {securiitySchema, new string[] {"Bearer"}}
                    });

                    // // Set the comments path for the Swagger JSON and UI.
                    // var xmlFile =
                    //     $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    // var xmlPath =
                    //     Path.Combine(AppContext.BaseDirectory, xmlFile);
                    // c
                    //     .IncludeXmlComments(xmlPath,
                    //     includeControllerXmlComments: true);
                    var filePath =
                        Path
                            .Combine(System.AppContext.BaseDirectory,
                            "API.xml");
                    c.IncludeXmlComments (filePath,includeControllerXmlComments:true);
                });
            return services;
        }

        public static IApplicationBuilder
        UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app
                .UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                });
            return app;
        }
    }
}
