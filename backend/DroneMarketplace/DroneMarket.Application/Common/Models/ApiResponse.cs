using System.Collections.Generic;

namespace DroneMarket.Application.Common.Models
{
    public class ApiResponse<T>
    {
        public bool Succeeded { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public ApiResponse() { }

        public ApiResponse(T data, string? message = null)
        {
            Succeeded = true;
            Message = message;
            Data = data;
            Errors = null;
        }

        public ApiResponse(string message)
        {
            Succeeded = false;
            Message = message;
            Data = default;
            Errors = new List<string> { message };
        }

        public ApiResponse(List<string> errors)
        {
            Succeeded = false;
            Message = "Validation Failed";
            Data = default;
            Errors = errors;
        }
    }
}
