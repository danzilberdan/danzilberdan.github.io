For a while now, I have been trying to find ways to integrate the “second brain” methodology into my workflow using Obsidian. As a byproduct, it resulted in the creation of the [MathLive](https://mathlive.danz.blog/) plugin which I’m going to tell you about in this post.

In addition to my work as a software engineer, I study computer science and math. I want to capture the knowledge I acquire in order to be able to efficiently use it in the future. Because of that, I have been trying to find an optimal workflow to quickly input math notes into my vault (folder).

Obsidian uses [MathJax](https://www.mathjax.org/) in order to store equations. This choice aligns with the standardized markdown note structure which is local and is not coupled to any specific software. The problem is that it is quite cumbersome to write.

For example, `x` divided by `x^2` is formatted as follows:
```
$\frac{x}{x^2}$
```

Doing integrals becomes even more complicated and is definitely not fun to write (which it should be!). So I started to look into available plugins and didn’t really find anything that solved my problem.

Luckily, Obsidian is easily extensible with a rich ecosystem of plugins. Creating a plugin is as simple as forking a [github repo](https://github.com/obsidianmd/obsidian-sample-plugin) and customizing it to our liking.

The next step was to find a way to input math easily. I found an amazing project called [Mathlive](https://cortexjs.io/mathlive/) which enables interactive editing of MathJax. I created a [plugin](https://mathlive.danz.blog/) that integrates with MathLive and provides additional productivity tweaks:

![Input Example](/images/mathlive_input.gif)

But that was not enough. In addition to manually typing math formulas, I also wanted a solution that would enable me to quote equations from textbooks and PDF docs.

In order to achieve that, I integrated the plugin with an OCR project called [LaTeX-OCR](https://github.com/lukas-blecher/LaTeX-OCR) which translates images into MathJax-compatible formulas.

Serving the OCR model requires technical skill and background resources and does not fit most users of the plugin. Because of that, I created a hosted version that can be easily used which only requires a network connection.

![Latex OCR](/images/latex_ocr.gif)

## A few more tips
To speed up math typing, I combine this plugin with Vim mode which is natively supported by Obsidian. Note that learning Vim took a long time and is recommended only for the ones who are willing to dedicate a significant amount of time to streamline their typing productivity.