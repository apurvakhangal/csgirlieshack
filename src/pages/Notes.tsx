import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateSummary, generateFlashcards, generateQuiz } from '@/lib/gemini';
import { extractTextFromFile, createNote } from '@/services/notesService';
import { getCurrentUserId } from '@/lib/auth';
import { Upload, FileText, Sparkles, Download, Loader2 } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function Notes() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      // Extract text from file
      const extractedText = await extractTextFromFile(uploadedFile);
      setContent(extractedText);

      // Auto-generate summary
      setIsGeneratingSummary(true);
      const summaryResult = await generateSummary(extractedText);
      setSummary(summaryResult);
      setIsGeneratingSummary(false);

      // Save note to database if user is logged in
      const userId = await getCurrentUserId();
      if (userId) {
        await createNote(userId, uploadedFile.name, extractedText);
      }

      toast({
        title: 'File processed',
        description: 'Your file has been uploaded and processed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error processing file',
        description: error.message || 'Failed to process file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!content) {
      toast({
        title: 'No content',
        description: 'Please upload a file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingFlashcards(true);
    try {
      const generatedFlashcards = await generateFlashcards(content);
      setFlashcards(generatedFlashcards);
      toast({
        title: 'Flashcards generated',
        description: `Generated ${generatedFlashcards.length} flashcards.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate flashcards.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!content) {
      toast({
        title: 'No content',
        description: 'Please upload a file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const generatedQuiz = await generateQuiz(content);
      setQuiz(generatedQuiz);
      toast({
        title: 'Quiz generated',
        description: `Generated ${generatedQuiz.length} quiz questions.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate quiz.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Smart Notes</h1>
        </div>
      </motion.div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Notes</CardTitle>
              <CardDescription>
                Upload PDFs, images, or documents. We'll extract and process the content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">Upload your file</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  PDF, DOC, DOCX, JPG, PNG up to 20MB
                </p>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Choose File</span>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </label>
                {file && (
                  <div className="mt-4">
                    <p className="text-sm text-success">
                      ✓ {file.name} uploaded successfully
                    </p>
                    {isProcessing && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing file...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI-Generated Summary</CardTitle>
                  <CardDescription>Key points and main concepts from your notes</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isGeneratingSummary ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating summary with AI...</p>
                </div>
              ) : summary ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{summary}</pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload a file to generate a summary
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flashcards Tab */}
        <TabsContent value="flashcards">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Flashcards</CardTitle>
              <CardDescription>Review key concepts with interactive flashcards</CardDescription>
            </CardHeader>
            <CardContent>
              {flashcards.length > 0 ? (
                <div className="space-y-4">
                  {flashcards.map((flashcard, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="mb-2 font-semibold">Q: {flashcard.question}</div>
                        <div className="text-sm text-muted-foreground">
                          A: {flashcard.answer}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">
                    {content
                      ? 'Click the button to generate flashcards from your notes'
                      : 'Upload a file first to generate flashcards'}
                  </p>
                  <Button
                    className="mt-4"
                    disabled={!content || isGeneratingFlashcards}
                    onClick={handleGenerateFlashcards}
                  >
                    {isGeneratingFlashcards ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Flashcards'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Quiz</CardTitle>
              <CardDescription>Test your knowledge with adaptive quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {quiz.length > 0 ? (
                <div className="space-y-6">
                  {quiz.map((question, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="mb-3 font-semibold">
                          {index + 1}. {question.question}
                        </div>
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                optIndex === question.correctAnswer
                                  ? 'bg-success/20 border border-success'
                                  : 'bg-muted'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correctAnswer && (
                                <span className="ml-2 text-success text-sm">✓ Correct</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">
                    {content
                      ? 'Click the button to generate a quiz from your notes'
                      : 'Upload a file first to generate a quiz'}
                  </p>
                  <Button
                    className="mt-4"
                    disabled={!content || isGeneratingQuiz}
                    onClick={handleGenerateQuiz}
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Quiz'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
