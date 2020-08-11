---
path: '/first-lua-script-data-validation'
date: '2020-07-21'
title: 'My First LUA Script and Data Validation'
tags: ['lua', 'script', '2020', 'data-validation', 'monitor', 'portrait']
excerpt: 'Nothing makes me want to tab to my code less than knowing I need to take the input of some user, and scrub that input clean of all errors, parse what is usable, and execute the script if possible.'
---
[Data validation](https://en.wikipedia.org/wiki/Data_validation) is a tiring exercise. Nothing makes me want to tab to my code less than knowing I need to take the input of some user, and scrub that input clean of all errors, parse what is usable, and execute the script if possible. Error handling is another bag of worms all together.

Let me explain what I'm doing with LUA in the first place. I probably don't need to introduce Minecraft, but if you are curious, here is the [Wikipedia link](https://en.wikipedia.org/wiki/Minecraft). I'm running this mod for Minecraft called [ComputerCraft](https://github.com/dan200/ComputerCraft) that is a computer emulator inside of the game. This computer is a very capable machine which supports displays, networking, vector rendering, and much more. this all runs from LUA scripts built on top of a Java executable.

This all naturally piqued my interests. Scrambling for ideas, I though the most beneficial would be to write a script that supports my [GitHub repository](https://github.com/michaelagard/computercraft_scripts) and downloads the latest version of my scripts pushed to my repo. This meant I'd have to learn LUA, or enough to get a script like this working.

I started just like everyone else with a `hello world.lua` script.
```
print("Hello world!")
```
Hey! It's simple, high level, and written plainly. So far so good. I then started looking into the basics: variables, conditionals, and functions. Coming from JavaScript, I was quickly becoming comfortable with LUA's syntax.

After I became somewhat comfortable with LUA, I dove into a fork of ComputerCraft called [CC: Tweaked](https://tweaked.cc/). The documentation was decent enough so I started seeing what was immediately understandable and started trying out all the new libraries available.

Then came the web searches. One notable repo to mention is Kyasaki's [computercraft-scripts](https://github.com/Kyasaki/computercraft-scripts) repository. He has a similar script that helped me understand LUA's IO library. Kudos to them!

I'm kind of writing around data validation, but I always get lost in the logic of my code. I'll try my best to explain it, and I'm sure I'll find something wrong with it now that I'm trying to describe my logic. I'll post the code at the bottom of this entry.

I start off writing a table that contains all my settings. We'll refer to this table later, but just know that we keep my repo url, branch, flags, scripts, errors, and version number.

I write a lot of functions. I showcase that in this project. Most of the smaller functions are near the top since the script executes top-to-bottom. I'm sure there is a name for that, but I don't know it.

Let's look at the relevant argument handling code.
`local  args = {...}` spreads all the arguments input from the CLI into a table called args that is indexed numerically. E.G. `{["1"] = "-s", ["2"] = "update", ...}`

We approach our first if statement. `if (#args == 0) then` 2 things to note here. We're checking if the total count of pairs in the args table is 0, and that the # denotes that I'm looking for the highest indexed number of pairs. This is important to denote because if my args variable had only one pair which was `{[4] = "-v"}` then `print(#args)` would return 4, since it takes the largest key digit and outputs that. If args held any other kind of keys, I'd have to use a different method to get the total count of arguments. We output the usage strings for the user to understand how to use this script.

The else portion of this if statement is where things get hairy. This is where we'll be manipulating our flags and arguments. This took my hours of my life to brainstorm how to accomplish. We immediately jump into a for … loop to iterate through our args and the first if statement.
```
if (settings.flags[args[i]] == nil and string.match(args[i], '^%-')) then
```
This if statement checks 2 things. The first check is to make sure that the argument doesn't exist in our setting's flag table and then checks if the argument starts with a hyphen. If both of these are true, we'll output our first error which uses a function I wrote called addError. Error handling is output using LUA's built in error() function. I just have a small library of errors to chose from in the settings. We use the "invalid_flag" option. Details below.

From here we start to dig into the valid arguments and flags. I use a function called validFlag to check the key of the "flags" table to see if the passed flag exists or not. Once the script determines the flag is valid, it goes down a list of a few if statements that …

Actually I just completely trashed this iteration of the project. I need to plan this out a little better. I'm going to outline my plans here.

**okUpdate.lua**: a script that will automatically download and update ComputerCraft scripts from a remote source. For example, typing `okupdate --script okmine okpaint --branch dev` will automatically download and update the scripts okmine and okpaint in the folder the program was ran in.

Options list:
Some options will have a parent (shorter) command with a child (larger)
* `-a --all` Download all scripts that are set as default within the settings table.
* `-s --script` Specify the script or scripts to update.
* `-b --branch` (github specific) Specify the branch the scripts should be downloaded from.
* `-v --version` Prints the version number and halts the program.
* `--debug` Shows additional printouts.

Step 1: Set up an object, or table with all the flags available and their options.
```
local settings = {
    ["base_repository_url"] = "https://raw.githubusercontent.com/michaelagard/computercraft_scripts",
    ["default_branch"] = "master",
    ["default_scripts"] = {"mine", "update"},
    ["branch"] = "",
    ["scripts"] = {},
    ["flags"] = {
        ["-b"] = {["arguments"] = {}, ["passed"] = false, ["descriptive_flag"] = "--branch", ["related_settings"] = "branch"},
        ["-s"] = {["arguments"] = {}, ["passed"] = false, ["descriptive_flag"] = "--script", ["related_settings"] = "scripts"},
        ["-a"] = {["passed"] = false, ["descriptive_flag"] = "--all", ["related_settings"] = "scripts"},
        ["-v"] = {["passed"] = false, ["descriptive_flag"] = "--version"},
        ["--debug"] = {["passed"] = false},
    },
    ["usage_string"] = "Usage: update [options...]\nFlags:\n-a --all: Updates default scripts.\n-b --branch <branch-name>\n-s --script <script1,script2>\n-v --version: Displays version number.\n",
    ["version"] = "2020.7.24.1",
}
```
local settings = {
    ["baseURL"] = "https://raw.githubusercontent.com/michaelagard/computercraft_scripts/",
    ["default_branch"] = {"master"},
    ["branch"] = {},
    ["flags"] = {
        ["-a"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "--all", ["rel_setting"] = "scripts"},
        ["-b"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "--branch", ["rel_setting"] = "branch"},
        ["-s"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "--script", ["rel_setting"] = "scripts"},
        ["--all"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "-a", ["rel_setting"] = "scripts"},
        ["--branch"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "-b", ["rel_setting"] = "branch"},
        ["--script"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "-s", ["rel_setting"] = "scripts"},
        ["--debug"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "--debug", ["rel_setting"] = "debug"},
        ["-v"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "--version", ["rel_setting"] = ""},
        ["--version"] = {["arguments"] = {}, ["passed"] = false, ["rel_flag"] = "--version", ["rel_setting"] = ""},
    },
    ["default_scripts"] = {"mine", "update"},
    ["scripts"] = {},
    ["debug"] = false,
    ["error"] = {},
    ["error_type"] = {
        ["duplicate_flag"] = function (flag) return "'" .. flag .. "'" .. " Duplicate flag found." end,
        ["invalid_flag"] = function (flag) return "'" .. flag .. "'" .. " is not a valid flag. Please type 'update' to see list of flags." end,
        ["download_error"] = function (files) return "Faild to open script '" .. files[1] .. "' at: " .. files[2] .. "." end,
        ["open_script"] = function (files) return "Faild to open script '" .. files[1] end,
        ["no_script"] = function () return "No script specified." end,
    },
    ["version"] = "2020.7.22.1"
}

local function debug()
    return settings.debug == true
end

local function addError(type, arg)
    table.insert(settings.error, settings.error_type[type](arg))
end

local function validFlag(flag)
    return settings.flags[flag] ~= nil
end

local function addFlagToIgnored(flag)
    settings.flags[flag].passed = true
    settings.flags[settings.flags[flag].rel_flag].passed = "ignored"
end

local function flagIgnored(flag)
    return settings.flags[flag].passed
end

local function addArgumentToFlag(flag, arg)
    if (debug()) then
        print("addArgumentToFlag", flag, arg)
    end

    table.insert(settings.flags[flag].arguments, arg)
end

local function updateSettings()
    for flagString, unusedValue in pairs(settings.flags) do
        if (settings.flags[flagString].passed == true) then
            local newSettings = {}
            local argument = settings.flags[flagString].arguments

            for i = 1, #argument, 1 do
                if (debug()) then
                    print("updateSettings()", settings.flags[flagString].rel_setting, argument[i])
                end

                table.insert(newSettings, argument[i])
            end
            
            settings[settings.flags[flagString].rel_setting] = newSettings
        end
    end

    if (settings.flags["-a"].passed == true) then
        settings.scripts = settings.default_scripts
    end

    if (settings.flags["-b"].passed == false) then
        settings.branch = settings.default_branch
    end
end

local function updateScript(script)
	local scriptUrl = settings.baseURL .. "/" .. settings.branch[1] .."/" .. script .. ".lua"
    local scriptPath = shell.dir() .. "/" .. script .. ".lua"
    io.write("> Attempting to download '" .. script .. ".lua' from the " .. settings.branch[1] .. " branch.\n")
	local remoteScript = http.get(scriptUrl)
    local localScript = fs.open(scriptPath, "w")
    
    if not remoteScript then
		addError("download_error", {script, scriptUrl})
    end

	if not localScript then
		addError("open_script", scriptPath .. script)
	end

	localScript.write(remoteScript.readAll())
	localScript.close()
end

local args = {...}
if (#args == 0) then
    io.write("Usage:\nupdate <options> <scripts>\nOptions/flags:\n-a --all : Updates all scripts.\n-b --branch <branch-name>\n-s --script <script1,script2>\n")

else
    for i = 1, #args, 1 do
        if (settings.flags[args[i]] == nil and string.match(args[i], '^%-')) then
            addError("invalid_flag", args[i])
        end

        if (validFlag(args[i])) then
            if (args[i] == "--debug") then
                settings.flags["--debug"].arguments = {true}
                settings.debug = true
            end

            if (args[i] == "-v" or args[i] == "--version") then
                settings.flags["-v"].arguments = {true}
                settings.flags["--version"].arguments = {true}
                print("v" .. settings.version)
            end

            if (debug()) then
                print("Valid flag Found at index: " .. i, args[i])
            end

            if (flagIgnored(args[i])) then
                addError("duplicate_flag", args[i])
            end

            addFlagToIgnored(args[i])
            CurrentArg = args[i]
            
        elseif (CurrentArg ~= nil) then
            addArgumentToFlag(CurrentArg, args[i])
        end
    end
    
    updateSettings()

    if (settings.scripts[1] == nil and "-v" == false) then
        addError("no_script")
    end

    if (#settings.error > 0) then
        for i = 1, #settings.error, 1 do
            error(settings.error[i])
        end
    else
        for i = 1, #settings.scripts, 1 do
            updateScript(settings.scripts[i])
        end
    end
end

if (debug()) then
    io.write("- Selected Scripts:\t")
    for i = 1, #settings.scripts, 1 do
        io.write(settings.scripts[i] .. " ")
    end
    io.write("\n- Selected Branch:\t", settings["branch"][1])
    io.write("\n- Selected Flags -\n", "-Flag-\t" .. "-Args-\n")
    for FlagString, unusedValue in pairs(settings.flags) do
        for i = 1, #settings.flags[FlagString].arguments , 1 do
            print("", FlagString, settings.flags[FlagString].arguments[i])
        end
    end
end
```