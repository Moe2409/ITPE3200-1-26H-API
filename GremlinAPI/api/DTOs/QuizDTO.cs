using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Gremlin.DTOs;

public class Quiz
{
    
    public int id {get; set;}
    public IdentityUser? user {get; set;}
    
    public string? title {get; set;}

    // Nested DTO list representing related question data, not a database navigation property
    public List<Question> Questions { get; set; } = new List<Question>();


}