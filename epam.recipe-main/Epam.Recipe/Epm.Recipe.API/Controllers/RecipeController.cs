using Epam.Recipe.Application.Services;
using Epam.Recipe.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Epm.Recipe.API.Controllers
{
    [Route("api/recipe")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;
        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostRecipe([FromBody] RecipeDTO recipe)
        {
            if (ModelState.IsValid)
            {
                await _recipeService.PostRecipe(recipe);
                var recipeUri = Url.Action("Get");
                return Created(recipeUri, recipe);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] RecipeDTO recipe)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid argument: parameter should be id" });
            }

            try
            {
                await _recipeService.UpdateRecipe(id, recipe);
                return Ok(recipe);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<RecipeResponseDTO>>> GetRecipes()
        {
            var recipes = await _recipeService.GetRecipes();
            if (recipes != null && recipes.Count > 0)
            {
                var recipeList = await _recipeService.GetRecipes();
                return Ok(recipeList);
            }
            else if (recipes != null && recipes.Count == 0)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Error fetching recipes from the service");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(int id, [FromQuery] int userId)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid argument: parameter should be id" });
            }

            try
            {
                await _recipeService.DeleteRecipe(id, userId);
                return NoContent(); // NoContent indicates that the resource was successfully deleted
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
