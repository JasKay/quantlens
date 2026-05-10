import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState("")

  const handleAuth = async () => {
    setLoading(true)
    setMessage("")

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
    } else if (isSignUp) {
      setMessage("Account created! Check your email to confirm, then sign in.")
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Quant<span className="text-blue-500">Lens</span>
        </h1>
        <p className="text-gray-400 text-sm">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAuth()}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        {message && (
          <p className="text-sm text-yellow-400 text-center">{message}</p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading || !email || !password}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all"
        >
          {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </button>

        <p className="text-center text-gray-500 text-sm pt-2">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  )
}
