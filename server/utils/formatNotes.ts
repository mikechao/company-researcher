export function formatAllNotes(completedNotes: string[]): string {
  let formattedStr = ''

  completedNotes.forEach((note, index) => {
    const idx = index + 1 // Since Python's enumerate started at 1
    formattedStr += `
${'='.repeat(60)}
Note: ${idx}:
${'='.repeat(60)}
Notes from research:
${note}`
  })

  return formattedStr
}
