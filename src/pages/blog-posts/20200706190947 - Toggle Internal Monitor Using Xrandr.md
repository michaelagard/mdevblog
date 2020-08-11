---
path: '/bash-toggle-monitor'
date: '2020-07-06'
title: 'Toggle Internal Monitor Using xrandr'
tags: ['bash', 'script', '2020', 'screen', 'monitor']
excerpt: 'A simple script that will toggle a monitor on or off.'
---
xRandR is a primitive command line interface to RandR extension. xRandR is used to set the size, orientation and/or reflection of the outputs for a screen. It can also set the screen size. It can also control whether or not the screen is on or off which is handy when a screen doesn't have an on and off switch such as a laptop monitor.

This article will cover a bash script that has two variables that you'll need to set. You can find the name of your screens using the `xrandr` command which the output looks like this.
```
kai@kai-pop-os:~/.scripts$ xrandr
Screen 0: minimum 8 x 8, current 1920 x 1080, maximum 32767 x 32767
HDMI-0 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 527mm x 296mm
   1920x1080     60.00*+  59.94    50.00  
   1680x1050     59.95  
   1600x900      60.00  
   1440x900      59.89  
   1280x1024     60.02  
   1280x800      59.81  
   1280x720      60.00    59.94    50.00  
   1024x768      60.00  
   800x600       60.32  
   720x576       50.00  
   720x480       59.94  
   640x480       59.94    59.93  
DP-0 connected (normal left inverted right x axis y axis)
   1920x1080     60.02 +
DP-1 disconnected (normal left inverted right x axis y axis)
DP-2 disconnected (normal left inverted right x axis y axis)
DP-3 disconnected (normal left inverted right x axis y axis)
DP-4 disconnected (normal left inverted right x axis y axis)

```
From this output I can see `HDMI-0` and `DP-0` are the two connected screens.

Once you have your variables set, the remaining code checks the monitor mode which is set inside of a temporary file in your `/tmp/` directory that records whether or not monitor mode is set to `all` or `EXTERNAL`. If it is set to `all`, both monitors will be switched on. If set to `EXTERNAL`, only the externally connected monitor will be turned on.
```
#!/bin/bash
EXTERNAL_OUTPUT="HDMI-0"
INTERNAL_OUTPUT="DP-0"

if [ ! -f "/tmp/monitor_mode.dat" ] ; then
  monitor_mode="all"

else
  monitor_mode=`cat /tmp/monitor_mode.dat`
fi
if [ $monitor_mode = "all" ]; then
        monitor_mode="EXTERNAL"
        xrandr --output $INTERNAL_OUTPUT --off --output $EXTERNAL_OUTPUT --auto
else
        monitor_mode="all"
        xrandr --output $INTERNAL_OUTPUT --auto --output $EXTERNAL_OUTPUT --auto --left-of $INTERNAL_OUTPUT
fi
```