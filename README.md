# microexpression
Detecting Micro-Expression Emotion in Real Time

Live at https://affectiva-web.surge.sh/

To see the app in action, just open the above link in web browser from your mobile phone. Have fun!

Based on https://github.com/Affectiva/js-sdk-sample-apps and https://jsfiddle.net/affectiva/opyh5e8d/show/

Idea behind this is to use Affectiva SDK to detect users emotions real time. We choose to implement this as Progressive Web App (PWA), keeping note of its increasing support and compatibility nowadays, and also since our use case only needs camera feature. Nothing else, no GPS, no mic whatsoever. Keeping things simple, this decision allows us to have a single codebase, and it will run on multiple platforms: web, android, ios. 

For now, we are only interested in emotions of joy and surprise.
Why? Because good things happens when we have these emotions. Imagine a user tries a sample of ice-cream,
and to his/her surprise, likes it. This data is really important for us to plan our future ice-cream flavors :)

Known issues:
Not quite PWA yet, missing the manifest file and app icon
Not quite working on iOS phones, though https://caniuse.com/#feat=serviceworkers says otherwise?
Older phones seems lagging