public class SubmitQuizDto
{
    public List<SubmittedQuestionDto> Questions { get; set; } = new();
}

public class SubmittedQuestionDto
{
    public int QuestionId { get; set; }
    public List<int> SelectedAnswerIndices { get; set; } = new();
}