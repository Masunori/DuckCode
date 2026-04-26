// Programming language
export type PLKeys = 'C' | 'C++' | 'Java' | 'JavaScript' | 'Python';

export type ProgrammingLanguage = {
    aliases: string[];
    runtime: string;
    version: string;
    monacoEditorAlias: string;
    codeSnippet: string;
};

export const PROGRAMMING_LANGUAGES: Record<PLKeys, ProgrammingLanguage> = {
    C: {
        aliases: ["gcc"],
        runtime: "gcc",
        version: "10.2.0",
        monacoEditorAlias: "c",
        codeSnippet: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`
    },

    "C++": {
        aliases: ["cpp", "g++"],
        runtime: "gcc",
        version: "10.2.0",
        monacoEditorAlias: "cpp",
        codeSnippet: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`
    },

    Java: {
        aliases: [],
        runtime: "jvm",
        version: "15.0.2",
        monacoEditorAlias: "java",
        codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    },

    JavaScript: {
        aliases: ["node-javascript", "node-js", "javascript", "js"],
        runtime: "node",
        version: "20.11.1",
        monacoEditorAlias: "javascript",
        codeSnippet: `console.log("Hello, World!");`
    },

    Python: {
        aliases: ["py", "py3", "python3", "python3.12"],
        runtime: "python",
        version: "3.12.0",
        monacoEditorAlias: "python",
        codeSnippet: `print("Hello, World!")`
    }
};

export const CODE_EDITOR_LIVE_PREVIEW_TEXT =
    `This live preview demonstrates changes to your code editor visual settings! 

Feel free to change the text.

The following is for whitespace rendering:
    All: Every whitespace is rendered as a small dot. |                                                                        
    None: Every whitespace is rendered as actual empty spaces. |                                                               
    Selection: The dots are only visible when you select a piece of text. |                                                    
    Boundary: Only the whitespace until the first non-whitespace character is rendered as dots in each line. |                 
    Trailing: Only the whitespace from the last non-whitespace character to the end of line is rendered as dots in each line. |

The following is for tab sizes:
0 space
 1 space
  2 spaces
   3 spaces
    4 spaces
     5 spaces
      6 spaces
       7 spaces
        8 spaces
         9 spaces
          10 spaces

The following is for word wrap:
    On: Lines wrap when reaching editor width (auto line break).
    Off: No word wrapping. Long lines scroll horizontally.
    Word Wrap Column: Each line can only be at most some number of characters long.
    Bounded: Text is wrapped based on the smaller value between editor width and word wrap column value
`;