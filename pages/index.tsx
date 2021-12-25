import type { NextPage } from "next"
import Head from "next/head"
import Estimator from "../components/Estimator"
import { ClientOnly } from "../composables/useHasMounted"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Food estimator</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/fork_knife_400.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className="container">
        <ClientOnly>
          <Estimator />
        </ClientOnly>
      </main>
    </div>
  )
}

export default Home
