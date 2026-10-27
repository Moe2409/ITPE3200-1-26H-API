using Microsoft.AspNetCore.Mvc;
using Gremlin.Models;
using Gremlin.DAL;
using Gremlin.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Gremlin.DTOs;
using Microsoft.AspNetCore.Components.Web;

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
    public async Task<IActionResult> QuizList()
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


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var quiz = await _quizRepository.GetItemById(id);
        if (quiz == null)
        {
            _logger.LogWarning("[QuizAPIController] Quiz with ID {Id} not found", id);
            return NotFound($"Quiz with ID {id} not found.");
        }

        var quizDto = new Gremlin.DTOs.Quiz
        {
            id = quiz.id,
            title = quiz.title,
            user = quiz.User,
            Questions = quiz.Questions.Select(q => new Gremlin.DTOs.Question
            {
                id = q.id,
                quiz_id = q.quiz_id,
                type_id = q.type_id,
                title = q.title,
                AnswerAlternatives = q.AnswerAlternatives,
                CorrectAnswerIndices = q.CorrectAnswerIndices
            }).ToList()
        };

        return Ok(quizDto);
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> Create ([FromBody] Gremlin.DTOs.Quiz quizDto)
    {
        if (quizDto == null)
        {
            return BadRequest("Quiz cannot be null");
        }
        var newQuiz = new Gremlin.Models.Quiz
        {
            title = quizDto.title, 
            User = quizDto.user,
            Questions = quizDto.Questions.Select(q => new Gremlin.Models.Question
                {
                    id = q.id,
                    quiz_id = q.quiz_id,
                    type_id = q.type_id,
                    title = q.title,

                    AnswerAlternatives = new List<string>(q.AnswerAlternatives),
                    CorrectAnswerIndices = new List<int>(q.CorrectAnswerIndices)
                }).ToList(),
        };
        bool returnOk = await _quizRepository.Create(newQuiz);
        if (returnOk)
            return CreatedAtAction(nameof(QuizList), new { id = newQuiz.id}, newQuiz);
        
        _logger.LogWarning("[QuizApiController] Quiz creation failed {@item}", newQuiz);
        return StatusCode(500, "Internal server error");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Gremlin.DTOs.Quiz quizDto)
    {
        if (quizDto == null || id != quizDto.id)
        {
            return BadRequest("Quiz ID mismatch or quiz data is null.");
        }

        // Check if the quiz exists first
        var existingQuiz = await _quizRepository.GetItemById(id);
        if (existingQuiz == null)
        {
            _logger.LogWarning("[QuizAPIController] Quiz with ID {Id} not found for update", id);
            return NotFound($"Quiz with ID {id} not found.");
        }

        // Map updated values
        existingQuiz.title = quizDto.title;
        var incomingIds = quizDto.Questions.Select(q => q.id).ToList();

        var questionsToRemove = existingQuiz.Questions.Where(q => !incomingIds.Contains(q.id)).ToList();
        foreach (var q in questionsToRemove)
        {
            existingQuiz.Questions.Remove(q);
            _gremlinDbContext.Questions.Remove(q);
        }

        foreach (var qDto in quizDto.Questions)
        {
            var existingQuestion = existingQuiz.Questions.FirstOrDefault(q => q.id == qDto.id);
            if (existingQuestion != null)
            {
                // Update properties of the already-tracked question in-place
                existingQuestion.type_id = qDto.type_id;
                existingQuestion.title = qDto.title;
                existingQuestion.AnswerAlternatives = new List<string>(qDto.AnswerAlternatives);
                existingQuestion.CorrectAnswerIndices = new List<int>(qDto.CorrectAnswerIndices);
            }
            else
            {
                // Add a brand new question to the tracked collection
                existingQuiz.Questions.Add(new Gremlin.Models.Question
                {
                    quiz_id = id,
                    type_id = qDto.type_id,
                    title = qDto.title,
                    AnswerAlternatives = new List<string>(qDto.AnswerAlternatives),
                    CorrectAnswerIndices = new List<int>(qDto.CorrectAnswerIndices)
                });
            }
        }

        bool success = await _quizRepository.Update(existingQuiz);
        if (success)
        {
            _logger.LogWarning("[QuizAPIController] Quiz with ID {Id} updated successfully", id);
            return Ok(existingQuiz);
        }

        _logger.LogWarning("[QuizAPIController] Quiz update failed for ID {Id}", id);
        return StatusCode(500, "Internal server error");
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool success = await _quizRepository.Delete(id);
        if (!success)
        {
            _logger.LogWarning("[QuizAPIController] Quiz deletion failed for ID {Id} (Not found or error)", id);
            return NotFound($"Quiz with ID {id} not found.");
        }

        return NoContent();
    }
}
