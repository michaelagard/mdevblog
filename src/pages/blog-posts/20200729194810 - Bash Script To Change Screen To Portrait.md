---
path: '/bash-script-switch-to-portrait'
date: '2020-07-29'
title: 'Bash Script To Change Screen To Portrait'
tags: ['bash', 'script', '2020', 'screen', 'monitor', 'portrait']
excerpt: 'Sometimes in Linux, you just want to execute a small task using a keyboard shortcut.'
---
Sometimes in Linux, you just want to execute a small task using a keyboard shortcut. Below is a script that allows me to reliably toggle between landscape and left screen orientation for my monitor labeled "HDMI-0". This script doesn't use any external file to save your orientation state as it calls greps through xrander's output to determine the orientation. Neat!

```
#!/bin/bash
#script_source: https://askubuntu.com/questions/563809/change-only-one-display-orientation-from-terminal/563945#563945

screen="HDMI-0"

descr=$(xrandr | grep "$screen")
if echo "$descr" | grep disconnected
then
        echo "No $screen connected"
        exit 1
fi

alt="left"
if echo "$descr" | grep --quiet -P "^[^(]*$alt"
then
        rotate="normal"
else
        rotate="$alt"
fi
xrandr --output $screen --rotate $rotate 
```