using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
namespace Gremlin.DTOs;

public class History
{
    public int id {get; set;}
    public string? user_id {get; set;}
    public int? quiz_id {get; set;}
    public string? quiz_title {get; set;}
    public DateTime? completed_at {get; set;}

    public int? score {get; set;}
    public int? maxPossibleScore {get; set;}
    public Quiz? Quiz { get; set; }
    public ICollection<HistoryAnswer> HistoryAnswers { get; set; } = new List<HistoryAnswer>();
}

   
