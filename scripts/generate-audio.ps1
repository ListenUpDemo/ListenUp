param([switch]$Legacy)
# Original demo scripts, synthesized locally using a Windows US English voice.
Add-Type -AssemblyName System.Speech
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$stories = @(
  @{ id='coffee-shop'; level='beginner'; lines=@(
    @('Barista','Good morning! Welcome to the coffee shop. What can I get for you today?'),
    @('Customer','Good morning. I would like a cappuccino, please.'),
    @('Barista','Of course. Would you like a small, medium, or large?'),
    @('Customer','A medium, please. And could I have it with oat milk?'),
    @('Barista','Absolutely. Would you like anything to eat? We have fresh pastries.'),
    @('Customer','A chocolate croissant would be lovely.'),
    @('Barista','Great choice. Is that for here or to go?'),
    @('Customer','For here, please. I would like to sit by the window.'),
    @('Barista','That will be seven dollars and fifty cents.'),
    @('Customer','Here you are. Thank you very much!'),
    @('Barista','You are welcome. Your order will be ready in a moment. Enjoy your morning!')) },
  @{ id='airport'; level='beginner'; lines=@(
    @('Agent','Good morning. May I see your passport and booking confirmation?'),
    @('Passenger','Here you are. I am flying to London today.'),
    @('Agent','Thank you. How many bags are you checking in?'),
    @('Passenger','Just one suitcase. I also have a small backpack for the cabin.'),
    @('Agent','That is fine. Would you prefer a window seat or an aisle seat?'),
    @('Passenger','A window seat, please. What time does boarding start?'),
    @('Agent','Boarding starts at two thirty. Your flight leaves from gate twelve.'),
    @('Passenger','Do I need to go through security first?'),
    @('Agent','Yes. Security is on your right. Please be at the gate twenty minutes before departure.'),
    @('Passenger','Thank you for your help. Have a good day!')) },
  @{ id='weekend'; level='beginner'; lines=@(
    @('Anna','Hi Ben! Do you have any plans for Saturday?'),
    @('Ben','Not yet. What would you like to do?'),
    @('Anna','Let us have a picnic in the park. The weather will be sunny.'),
    @('Ben','That sounds great! I can bring some sandwiches.'),
    @('Anna','Perfect. I will bring fruit and drinks. Shall we meet at eleven?'),
    @('Ben','Yes, eleven is good. Where shall we meet?'),
    @('Anna','At the main entrance, near the big tree.'),
    @('Ben','I know the place. Can I invite my sister?'),
    @('Anna','Of course! The more, the merrier. See you on Saturday!')) },
  @{ id='meeting'; level='intermediate'; lines=@(
    @('Manager','Good morning, everyone. Let us review our progress. The deadline for our project is this Friday.'),
    @('Sarah','The research is complete. I will prepare the presentation. It should be ready by Thursday afternoon.'),
    @('Manager','Excellent. David, how is the budget looking?'),
    @('David','We are within budget. However, we need to confirm the final costs with our supplier.'),
    @('Manager','Please contact them today. Sarah, could you share a draft with the team before the final version?'),
    @('Sarah','Certainly. I will send everyone a draft tomorrow so there is time for feedback.'),
    @('Manager','Perfect. Let us have another check-in on Wednesday morning. Please let me know if anything blocks your progress. Thank you, everyone.')) },
  @{ id='bookshop'; level='intermediate'; lines=@(
    @('Emma','My name is Emma, and I opened this bookshop ten years ago. The building used to be a bakery, and sometimes I think you can still smell the fresh bread.'),
    @('Emma','When I first moved here, I wanted to create a place where people could slow down and discover something unexpected.'),
    @('Emma','We do not just sell books. Every Saturday, we host a reading group. People from all over the neighborhood come to share their favorite stories.'),
    @('Emma','My favorite part of the job is recommending a book to someone and seeing them return to tell me how much they loved it.'),
    @('Emma','Running a small business is not always easy, but these little connections make it worthwhile. Next month, we are adding a small corner where visitors can enjoy a cup of tea.')) },
  @{ id='remote-work'; level='advanced'; lines=@(
    @('Speaker','Remote work has fundamentally changed how we think about the workplace. The greatest advantage is flexibility. Employees can organize their schedules around the hours when they are most productive.'),
    @('Speaker','However, this freedom comes with challenges. Many workers report a sense of isolation, particularly when informal conversations and spontaneous collaboration disappear.'),
    @('Speaker','There is also the question of boundaries. When your home becomes your office, switching off at the end of the day can be surprisingly difficult.'),
    @('Speaker','I would recommend a hybrid approach. Spending a few days in the office allows teams to build relationships, while remote days provide space for focused work.'),
    @('Speaker','Ultimately, the goal should be to measure results rather than hours spent at a desk. Organizations that trust their employees are more likely to create a sustainable working culture.')) }
)
if (-not $Legacy) {
  $stories = Get-Content (Join-Path $root 'src/data/mock/us-lessons.json') -Raw -Encoding UTF8 | ConvertFrom-Json
}
$timings = [ordered]@{}
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice = $synth.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -eq 'en-US' } | Select-Object -First 1
if (-not $voice) { throw 'A US English Windows speech voice is required.' }
$synth.SelectVoice($voice.VoiceInfo.Name)
$synth.Rate = -1
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
foreach ($story in $stories) {
  $stream = New-Object System.IO.MemoryStream
  $synth.SetOutputToAudioStream($stream, $format)
  $transcript = @()
  foreach ($line in $story.lines) {
    $start = $stream.Position / 32000
    $synth.Speak($line[1])
    $end = $stream.Position / 32000
    $transcript += @{start=[Math]::Round($start,2); end=[Math]::Round($end,2); speaker=$line[0]; text=$line[1]}
  }
  $synth.SetOutputToNull()
  $folder = if ($Legacy) { $story.level } elseif ($story.level -eq 'B1') { 'intermediate' } else { 'beginner' }
  $audioPath = Join-Path $root "public/assets/audio/$folder/$($story.id).wav"
  $pcm = $stream.ToArray()
  $file = [IO.File]::Create($audioPath)
  $writer = New-Object IO.BinaryWriter($file)
  $writer.Write([Text.Encoding]::ASCII.GetBytes('RIFF'))
  $writer.Write([int](36 + $pcm.Length))
  $writer.Write([Text.Encoding]::ASCII.GetBytes('WAVEfmt '))
  $writer.Write([int]16); $writer.Write([int16]1); $writer.Write([int16]1)
  $writer.Write([int]16000); $writer.Write([int]32000); $writer.Write([int16]2); $writer.Write([int16]16)
  $writer.Write([Text.Encoding]::ASCII.GetBytes('data')); $writer.Write([int]$pcm.Length); $writer.Write($pcm)
  $writer.Dispose()
  $transcript | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 (Join-Path $root "public/assets/transcripts/$($story.id).json")
  if (-not $Legacy) {
    $sample = $transcript[$story.sample]
    $timings[$story.id] = [ordered]@{duration=[Math]::Round($end); start=$sample.start; end=$sample.end; folder=$folder}
  }
  Write-Output "$($story.id): $([Math]::Round($end,1)) seconds"
  $stream.Dispose()
}
$synth.Dispose()
if (-not $Legacy) {
  $json = $timings | ConvertTo-Json -Depth 4
  [IO.File]::WriteAllText((Join-Path $root 'src/data/mock/usAudioTimings.json'), $json)
}
