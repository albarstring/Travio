/**
 * Download certificate as PDF using html2pdf library with fallback
 * This function converts HTML certificate to PDF and triggers download
 */
export async function downloadCertificateAsPDF(
  certificateId: string,
  userName: string,
  courseName: string
) {
  try {
    console.log('[PDF] Starting certificate download for:', certificateId)
    
    // Load html2pdf script if not already loaded
    if (!(window as any).html2pdf) {
      console.log('[PDF] Loading html2pdf library...')
      await loadHtml2Pdf()
      console.log('[PDF] html2pdf library loaded')
    }

    // Fetch certificate HTML from API
    console.log('[PDF] Fetching certificate HTML...')
    const response = await fetch(`/api/certificates/${certificateId}/download`)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch certificate: ${response.status} - ${errorText}`)
    }

    const { html, fileName } = await response.json()
    console.log('[PDF] Certificate HTML fetched, file will be:', fileName)

    // Create temporary container for the HTML
    const element = document.createElement('div')
    element.innerHTML = html
    element.style.display = 'none'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    document.body.appendChild(element)

    // Get the certificate div
    const certificateDiv = element.querySelector('.certificate') as HTMLElement
    if (!certificateDiv) {
      throw new Error('Certificate element not found in generated HTML')
    }

    console.log('[PDF] Certificate element found, generating PDF...')
    console.log('[PDF] Triggering PDF download...')

    // Configure html2pdf options with proper callback
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      },
      jsPDF: { 
        orientation: 'landscape', 
        unit: 'mm', 
        format: 'a4',
        compress: true
      }
    }

    // Generate and download PDF with callback
    const html2pdf = (window as any).html2pdf()
    
    // Use promise-based approach
    await new Promise((resolve, reject) => {
      html2pdf
        .set(opt)
        .from(certificateDiv)
        .toPdf()
        .get('pdf')
        .then((pdf: any) => {
          console.log('[PDF] PDF generated, triggering download...')
          pdf.save(fileName)
          console.log('[PDF] PDF download triggered')
          resolve(true)
        })
        .catch((error: any) => {
          console.error('[PDF] Error in PDF generation:', error)
          reject(error)
        })
    })

    console.log('[PDF] PDF generation completed')

    // Cleanup
    setTimeout(() => {
      if (document.body.contains(element)) {
        document.body.removeChild(element)
      }
      console.log('[PDF] Cleanup completed')
    }, 1000)

    // Show success notification
    console.log('[PDF] Certificate downloaded successfully!')
    alert(`✅ Certificate downloaded!\n\nFile: ${fileName}\n\nCheck your Downloads folder.`)

    return true
  } catch (error) {
    console.error('[PDF] Error downloading certificate:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    alert(`❌ Failed to download certificate: ${errorMsg}\n\nPlease try again or contact support.`)
    throw error
  }
}

/**
 * Dynamically load html2pdf library from CDN
 */
function loadHtml2Pdf(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load html2pdf library'))
    document.head.appendChild(script)
  })
}

