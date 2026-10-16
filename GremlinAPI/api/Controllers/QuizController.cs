using Microsoft.AspNetCore.Mvc;
using Gremlin.Models;
using Gremlin.DAL;
using Gremlin.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Gremlin.DTOs;

namespace Gremlin.Controllers;

//handles quiz related operations like liting, viewing, taking, submitting and creating quizzes 
[ApiController]
[Route("api/quiz")]
public class QuizAPIController : ControllerBase
{   
    private readonly IQuizRepository _quizRepository;
    private readonly ILogger<QuizAPIController> _logger;
    private readonly GremlinDbContext _gremlinDbContext;
    private readonly UserManager<IdentityUser> _userManager;


    public QuizAPIController(
        GremlinDbContext gremlinDbContext, 
        ILogger<QuizAPIController> logger,
        UserManager<IdentityUser> userManager,
        IQuizRepository quizRepository)
    {
        _gremlinDbContext = gremlinDbContext;
        _logger = logger;
        _userManager = userManager;
        _quizRepository = quizRepository;
    }

   [HttpGet("all")]
    public async Task<IActionResult> ItemList()
    {
        var quizzes = await _quizRepository.GetAll();
        if (quizzes == null)
        {
            _logger.LogError("[QuizAPIController] Item list not found while executing _itemRepository.GetAll()");
            return NotFound("Item list not found");
        }     
        var quizDtos = quizzes.Select(quiz => new Gremlin.DTOs.Quiz
        {
            id = quiz.id,
            title = quiz.title,
            user = quiz.User,
            Questions = quiz.Questions.Select(q => new Gremlin.DTOs.Question
                {
                    id = q.id,
                    title = q.title,
                    AnswerAlternatives = q.AnswerAlternatives,
                    CorrectAnswerIndices = q.CorrectAnswerIndices
                }).ToList()
        });        
        return Ok(quizDtos);
    }
    
}
