# fluidi
> decentralized audio-first social media

The internet is broken
One reason the internet is broken is that we've stripped away so much of what makes communication valuable.
Text-based interactions lead to misunderstandings and unecessary arguments. 
Fluidi changes that, by bringing the human voice back into the conversation.



## Features 



## dev log




#### how to do encrypted end to end messaging 
steps:
Alice wants to talk to Bob.
Alice sends a link to Bob that contains:
- her public key
- a uuid that she will save messages for Bob at (alice/uuid)
Alice subscribes to (public/uuid). This is where Bob will write his public key when he accepts Alice's invite.
Bob clicks the link Alice sent him. The link takes him to a page that:
- saves Alice's publick key and alias in his "Contacts" directory
- subscribes to data in Alice's directory (alice/uuid)
- writes his public key and alias to (public/uuid)
> this opens up a man-in-the-middle attack where anyone could write to the public directory and impersonate Bob. Alice would think she was really talking to Bob when in reality she was talking with Chad. *sigh*

idea #2! Iris-lib
<!-- 
Alice sends a link to Bob with her:
- public key (not worrying about alias' right now)

Bob clicks the link. he opens a channel with alice's public key
Bob sends a message to the new channel 
nevermind
there's a better way
-->

I'm just going to fork Iris-Messenger, and host it as a subdomain on <href="https://messenger.fluidi.xyz/fluidi.xyz">. Then I'll learn how to use it, and make any changes I see necessary. 