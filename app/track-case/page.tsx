"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  caseId: z.string().min(5, {
    message: "Case ID must be at least 5 characters.",
  }),
})

// Mock case data
const mockCaseData = {
  id: "INC-123456",
  date: "2023-05-15",
  time: "14:30",
  location: "Central Park, New York",
  type: "Harassment",
  status: "In Progress",
  description: "Verbal harassment while walking through the park.",
  updates: [
    {
      date: "2023-05-15",
      time: "15:45",
      message: "Case received and assigned to Officer Johnson.",
    },
    {
      date: "2023-05-16",
      time: "10:30",
      message: "Investigation initiated. Contacting witnesses.",
    },
    {
      date: "2023-05-18",
      time: "09:15",
      message: "Reviewing security camera footage from the area.",
    },
  ],
}

export default function TrackCasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [caseData, setCaseData] = useState<typeof mockCaseData | null>(null)
  const [notFound, setNotFound] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseId: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setNotFound(false)
    setCaseData(null)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, only show data for a specific ID
      if (values.caseId === "INC-123456") {
        setCaseData(mockCaseData)
      } else {
        setNotFound(true)
      }
    }, 2000)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "New":
        return "bg-blue-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Track Your Case</h1>
          <p className="text-muted-foreground">Enter your case ID to check the current status and updates</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="caseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. INC-123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Track Case"
              )}
            </Button>
          </form>
        </Form>

        {notFound && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Case Not Found</CardTitle>
              <CardDescription>
                We couldn't find a case with the ID you provided. Please check the ID and try again.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <p className="text-sm text-muted-foreground">For demo purposes, try using case ID: INC-123456</p>
            </CardFooter>
          </Card>
        )}

        {caseData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Case {caseData.id}</CardTitle>
                <Badge className={getStatusColor(caseData.status)}>{caseData.status}</Badge>
              </div>
              <CardDescription>
                Reported on {caseData.date} at {caseData.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">{caseData.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Type</h3>
                  <p className="text-sm text-muted-foreground">{caseData.type}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{caseData.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Case Updates</h3>
                <div className="space-y-3">
                  {caseData.updates.map((update, index) => (
                    <div key={index} className="border-l-2 border-rose-200 pl-4 py-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{update.date}</p>
                        <p className="text-sm text-muted-foreground">{update.time}</p>
                      </div>
                      <p className="text-sm">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
