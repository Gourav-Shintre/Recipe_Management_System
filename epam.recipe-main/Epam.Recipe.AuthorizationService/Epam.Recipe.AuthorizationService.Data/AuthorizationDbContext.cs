using Epam.Recipe.AuthorizationService.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Data
{
    public class AuthorizationDbContext:DbContext
    {
        public AuthorizationDbContext(DbContextOptions<AuthorizationDbContext> options)
           : base(options)
        {
        }


        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
