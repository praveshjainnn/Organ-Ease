import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Shield, Award, Target, Globe } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: "Life-Saving Mission",
      description:
        "Our platform connects organ donors with recipients to save lives and give hope to families worldwide.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community. Every user contributes to our life-saving network.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical information is protected with enterprise-grade security and privacy measures.",
    },
    {
      icon: Award,
      title: "Medically Verified",
      description: "All organ donations and requests are verified by qualified medical professionals.",
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Advanced algorithms ensure the best possible matches based on compatibility and location.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting donors and recipients across the globe to maximize life-saving opportunities.",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Lives Saved" },
    { number: "25,000+", label: "Registered Users" },
    { number: "500+", label: "Successful Matches" },
    { number: "50+", label: "Partner Hospitals" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About OrganEase</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            OrganEase is a revolutionary platform designed to streamline organ donation management, connecting donors
            and recipients to save lives and bring hope to families around the world.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              To create a world where no one dies waiting for an organ transplant. We believe that by leveraging
              technology and building a strong community of donors and recipients, we can dramatically increase the
              success rate of organ matching and save more lives than ever before.
            </p>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How OrganEase Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Register</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account as either a donor or recipient with your medical information
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Match</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our advanced algorithm finds compatible matches based on medical criteria
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get connected with your match and coordinate with medical professionals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Commitment</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We are committed to maintaining the highest standards of medical ethics, privacy protection, and user
            safety. Our platform is continuously monitored and improved by medical professionals and technology experts
            to ensure the best possible outcomes for all users.
          </p>
        </div>
      </div>
    </div>
  )
}
