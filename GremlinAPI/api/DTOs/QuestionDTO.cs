using System.Text.Json;
using System.ComponentModel.DataAnnotations;
namespace Gremlin.DTOs;

public class Question
{
    public int id {get; set;}
    public int? quiz_id {get; set;}
    public int? type_id {get; set;}
    public string? title {get; set;}

    // Json representaion of question answers
    // public string? content;  

    public List<string> AnswerAlternatives { get; set; } = new List<string>();
    public List<int> CorrectAnswerIndices { get; set; } = new List<int>();

   
}