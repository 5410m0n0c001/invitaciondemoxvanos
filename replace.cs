using System;
using System.IO;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        try {
            string text = File.ReadAllText("c:\\Users\\quant\\Documents\\invitacion-demo\\index.html", System.Text.Encoding.UTF8);
            string pattern = @"<div class=""section-corner-container"">.*?</div>";
            string replacement = "<div class=\"section-corner-container\">\r\n                <img src=\"esquinasuperiorizquierda.png\" alt=\"\" class=\"section-corner corner-tl\">\r\n                <img src=\"esquinasuperiorderecha.png\" alt=\"\" class=\"section-corner corner-tr\">\r\n                <img src=\"esquina1.png\" alt=\"\" class=\"section-corner corner-bl\">\r\n                <img src=\"esquina2.png\" alt=\"\" class=\"section-corner corner-br\">\r\n            </div>";
            string result = Regex.Replace(text, pattern, replacement, RegexOptions.Singleline);
            File.WriteAllText("c:\\Users\\quant\\Documents\\invitacion-demo\\index.html", result, System.Text.Encoding.UTF8);
            Console.WriteLine("Replacement successful.");
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
