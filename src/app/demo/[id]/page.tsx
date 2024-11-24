interface DemoPageProps {
  params: {
    id: string
  }
}

export default function DemoPage({ params }: DemoPageProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Logo */}
      <div 
        className="absolute inset-0 opacity-5 transform -rotate-12"
        style={{
          backgroundImage: 'url(/logos/client-logo.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Voiceflow chat widget will be injected here */}
      </div>
    </div>
  )
}

// This will be replaced with actual data fetching
export async function generateStaticParams() {
  return []
}
