using Epam.Recipe.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace Epam.Recipe.Data
{
    public class RecipeDbContext : DbContext
    {
        public RecipeDbContext(DbContextOptions<RecipeDbContext> options) : base(options)
        {
        }
        public virtual DbSet<RecipeModel> Recipes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
