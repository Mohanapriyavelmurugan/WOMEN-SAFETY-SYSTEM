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
import { incidentApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  caseId: z.string().min(5, {
    message: "Case ID must be at least 5 characters.",
  }),
})

export default function TrackCasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [caseData, setCaseData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseId: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await incidentApi.getCase(values.caseId);
      setCaseData(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch case details. Please check the case ID and try again.");
      setCaseData(null);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Track Your Case</h1>
          <p className="text-muted-foreground">Enter your case ID to view the status and updates</p>
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
                    <Input placeholder="Enter your case ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking Case...
                </>
              ) : (
                "Track Case"
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {caseData && (
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
              <CardDescription>Case ID: {caseData.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{caseData.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p>{caseData.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>{caseData.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p>{caseData.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{caseData.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={caseData.status === "In Progress" ? "bg-rose-600" : "bg-gray-500"}>
                  {caseData.status}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <h3 className="font-medium">Case Updates</h3>
                <div className="space-y-4">
                  {caseData.updates.map((update: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-24 text-sm text-muted-foreground">
                        {update.date}
                        <br />
                        {update.time}
                      </div>
                      <div className="flex-1">
                        <p>{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
