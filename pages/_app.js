import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div dir="rtl" className="font-arabic">
      <Component {...pageProps} />
    </div>
  )
}
