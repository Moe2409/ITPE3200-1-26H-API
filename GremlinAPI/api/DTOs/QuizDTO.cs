using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Gremlin.DTOs;

public class Quiz
{
    
    public int id {get; set;}
    public string? user_id {get; set;}
    public string? title {get; set;}


}