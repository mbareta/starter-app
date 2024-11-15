# Course Assistant Module

This module provides connection to OpenAI ChatGPT Assistant API. It is used for
course assistant feature where the user can interact with LLM to ask for help
with course content.

The idea is that we can RAG upload course content to an OpenAI Assistant and
tweak its system prompt to behave like helpful assistant.

This feature requires two .env vars: OPENAI_API_KEY and OPENAI_ASSISTANT_ID.
Both can be found in OpenAI platform pages.

Next steps are to export course content to a text file which we can then provide
to the Assistant.

## OpenAI API flow

In order to use the OpenAI Assistants API, we cannot simply call the Assistant
API.
The correct flow is:
1. create a new thread
2. add user message in that thread
3. create a streaming thread run

The response of the streaming thread run notifies us when about the run status
in real time, streams chunks of response and notifies about the run end.

This allows us to just wait and write chunks of response to our own HTTP response
and simply close the HTTP response once the thread run is completed.

Creating a thread with messages allows us to insert additional messages which are
invisible to the user and can serve as context to the LLM. This could be useful
in personalization feature where we can put messages that contain user information
and course progress so the LLM can provide more accurate response.

## Controller endpoints

- POST /course-assistant - returns streaming HTTP response which contains text
of the assistant response


## TBD

1. continue existing thread while the user is active (if the user sends threadId
param, we should continue using that thread)
2. add course upload to the Assistant
3. upload personal info as the first message
4. add instructions to this README on how to set up OpenAI Assistant
