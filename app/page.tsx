import { Appbar } from "@/components/Appbar";
import { Redirect } from "@/components/Redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Users, Zap, Radio } from "lucide-react";
import Link from "next/link";

export default function MusicStreamLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Appbar />
      <Redirect />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-300">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Where creators and fans unite to create the perfect soundtrack
                  for every stream.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-purple-300">
              Features That Hit the Right Note
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-100">
                  Fan Interaction
                </h3>
                <p className="text-gray-400">
                  Let your audience choose the music.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Zap className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-100">
                  Real-time Updates
                </h3>
                <p className="text-gray-400">
                  See song requests and votes as they happen.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Radio className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-100">
                  Seamless Integration
                </h3>
                <p className="text-gray-400">
                  Works with your favorite streaming platforms.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="cta"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-300">
                  Ready to Amplify Your Stream?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Join MusicStream today and create unforgettable experiences
                  with your fans.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Get Started
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-gray-400">
          © 2024 MusicStream. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-purple-400"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-purple-400"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
