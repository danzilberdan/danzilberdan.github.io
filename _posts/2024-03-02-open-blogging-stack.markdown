---
layout: single
title: The Open Blogging Stack
categories: 
---

The internet evolved as a distributed network of loosley coupled and specialized services.
Competing for revenue, services expanded their offerings and locked their users by using closed protocols.
For example, open IM protocols like [XMPP](https://xmpp.org/) were replaced by closed apps like WhatsApp.

Content on the internet was affected by this change as well.
The audience that was once consuming self hosted websites, forums, email and RSS turned to centralized social media sites.
Competing for attention, these sites incentivized the creation of a [dopamine trap](https://sitn.hms.harvard.edu/flash/2018/dopamine-smartphones-battle-time/) which hurts both the users and the creators.

This intro sets the scene for the motivation for decentralized content distributions.
With that motivation, I would like to devote this blog post to describe an open approach to blogging with the goal of being:
- **Owned** - Ownership of your digital property and audience.
- **Specialized** - The use of specialized services concerned with a single task.
- **Simple**

The stack uses [Jekyll](https://jekyllrb.com/), [Github Pages](https://pages.github.com/) and [Buttondown](https://buttondown.email/).

## Jekyll
Jekyll is an [open source](https://github.com/jekyll/jekyll) software for publishing markdown formatted content.
Being plain text, markdown is very portable.
The markdown is tranformed into static websites which are just bundles of html, css and js files which can be served by any [CDN](https://en.wikipedia.org/wiki/Content_delivery_network).

## Github Pages
Github pages is a convenient way of hosting static sites with built-in versioning.
It automatically publishes your site to it's own CDN.
That said, thanks to the simplicity of this setup, Github can easily be replaced by any other CDN.

## Buttondown
Buttondown is a highly specialized newsletter service, balancing simplicity with tailored features.
It's pricing model is fair while being specialized and thus easily replaceable.

![Flow](/images/JGB-flow.svg){:style="display:block; margin-left:auto; margin-right:auto"}

As seen above, posts such as this one are written using [markdown](https://github.com/danzilberdan/danzilberdan.github.io/blob/master/_posts/2024-03-02-buttondown-jekyll.markdown) inside a [Jekyll project](https://github.com/danzilberdan/danzilberdan.github.io).
The project is pushed to a Git repository on Github.
Github is configured to re-build the site and host it on Github Pages.
The site uses a <a target="_blank" onclick="popupNewsletter()">subscription form</a> that points to Buttondown.
Buttondown regularly fetches new posts from Jekyll's [RSS](https://en.wikipedia.org/wiki/RSS) feed and sends emails in a [configurable manner](https://buttondown.email/features/rss).

# Setup
## Site
- Create a Jekyll blog on Github Pages following [Github's guide](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- Add an RSS feed to your site by adding `gem 'jekyll-feed'` to your site's `Gemfile`
- **Optional** - [Link a custom domain](https://richpauloo.github.io/2019-11-17-Linking-a-Custom-Domain-to-Github-Pages/)

## Email Newsletter
- Create a [Buttondown account](https://buttondown.email/)
- Navigate to Buttondown's settings page ➡️ Embedding ➡️ Form
- Here you find an email form. You can copy the HTML code to your site and customize it to your liking.

- ![Flow](/images/buttondown-html-form.webp){:style="display:block; margin-left:auto; margin-right:auto"}

## Custom Form
If you would like a form that pops up automatically with a simple and customizable logic like <a target="_blank" onclick="popupNewsletter()">this</a>, follow along.
- Create an `_includes` folder in your project root. Jekyll themes include files that are placed here. This is useful when the sites functionality needs to be customized.
- In it, create a file named `email-form.html` with the following content:
- <details><summary>Show HTML</summary><div class="language-html highlighter-rouge"><div class="highlight"><pre class="highlight"><code id="html-form" style="white-space: pre-wrap"></code></pre></div></div></details>
- Make sure to then update the `action` and `onsubmit` according to your urls (found in Buttondown's settings page ➡️ Embedding ➡️ Form)
- Customize the title, paragraph, etc..
- Finally create a file named `_includes/head-custom.html` and place the following line: 
```{% raw  %}
{% include email-form.html %}
{% endraw %}```
- Note that this file's location may change based on the theme you use. I personally use minimal-mistakes and thus I place this text in `_includes/footer/custom.html`
- Add a subscribe button that actively pops up the form like so:
```{% raw  %}
<button onclick="popupNewsletter()">Subscribe</button>
{% endraw %}```
- Read the included js to understand the form's logic and change it if required

Want to experience Buttondown's subscription experience?

<a target="_blank" onclick="popupNewsletter()">Let's go😎</a>


<script>
    const text = "&lt;footer&gt;\n  &lt;div id=&quot;email-modal&quot; class=&quot;email-modal&quot;&gt;\n    &lt;div class=&quot;email-modal-content&quot;&gt;\n      &lt;span class=&quot;close&quot;&gt;&amp;times;&lt;/span&gt;\n      &lt;form\n        id=&quot;email-form&quot;\n        action=&quot;CHANGE&quot;\n        method=&quot;post&quot;\n        target=&quot;popupwindow&quot;\n        onsubmit=&quot;window.open('CHANGE', 'popupwindow')&quot;\n        class=&quot;email-form&quot;&gt;\n        &lt;h1&gt;\n          Join my Newsletter 📝\n        &lt;/h1&gt;\n        &lt;p&gt;\n          Stay up to date with my projects, tips and thoughts in general.\n        &lt;/p&gt;\n        &lt;div class=&quot;spacer&quot;&gt;&lt;/div&gt;\n        &lt;label for=&quot;bd-email&quot;&gt;Your email&lt;/label&gt;\n        &lt;input type=&quot;email&quot; name=&quot;email&quot; id=&quot;bd-email&quot; /&gt;\n        &lt;div class=&quot;spacer&quot;&gt;&lt;/div&gt;\n        \n        &lt;span class=&quot;email-buttons&quot;&gt;\n          &lt;input class=&quot;subscribe&quot; type=&quot;submit&quot; value=&quot;Subscribe&quot; /&gt;\n          &lt;div class=&quot;skip-container&quot;&gt;\n            &lt;a class=&quot;underline&quot; onclick=&quot;onSkipForNow()&quot; target=&quot;_blank&quot;&gt;Maybe later&lt;/a&gt;\n          &lt;/div&gt;\n        &lt;/span&gt;\n        &lt;p class=&quot;light&quot;&gt;Powered by &lt;a target=&rdquo;_blank&rdquo; class=&quot;underline&quot; href=&quot;https://buttondown.email/&quot;&gt;Buttondown&lt;/a&gt;&lt;/p&gt;\n      &lt;/form&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n    \n  &lt;style&gt;\n    .email-modal {\n      display: none;\n      position: fixed;\n      z-index: 1000;\n      left: 0;\n      top: 0;\n      width: 100vw;\n      height: 100vh;\n      overflow: auto;\n      margin: 0 auto;\n      background-color: #b1b1b194;\n    }\n    \n    .email-modal-content {\n      background-color: rgb(27, 28, 32);\n      margin: 10% auto;\n      padding: 20px;\n      max-width: min(90%, 40rem);\n      border-radius: 5px;\n    }\n    .email-form {\n      margin: auto;\n      background-color: transparent;\n    }\n    .email-form h1 {\n      font-size: 1.5rem;\n      color: rgb(255, 255, 255);\n    }\n    \n    .close {\n      color: #aaa;\n      float: right;\n      font-size: 28px;\n      font-weight: bold;\n      vertical-align: top;\n    }\n    \n    .close:hover,\n    .close:focus {\n      color: black;\n      text-decoration: none;\n      cursor: pointer;\n    }\n    .email-buttons {\n      display: flex;\n      flex-direction: row;\n      justify-content: space-between;\n    }\n    .subscribe {\n      width: 65% !important;\n      background-color: rgb(0, 151, 197);\n      color: white;\n      padding: 0.5rem;\n      margin: 0;\n    }\n    .skip-container {\n      width: 30% !important;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n    }\n    .underline {\n      text-decoration: underline !important;\n    }\n    .skip-container a {\n      font-weight: 300;\n    }\n    .spacer {\n      height: 1rem;\n    }\n    .light {\n      font-weight: 300;\n    }\n    .masthead {\n      z-index: 0;\n    }\n  &lt;/style&gt;\n  &lt;script&gt;\n    const modal = document.getElementById(&quot;email-modal&quot;);\n    const form = document.getElementById(&quot;email-form&quot;);\n    const span = document.getElementsByClassName(&quot;close&quot;)[0];\n    const poped = JSON.parse(window.localStorage.getItem('poped'));\n    if (!poped) {\n      setTimeout(() =&gt; {\n        popupNewsletter()\n        window.localStorage.setItem('poped', JSON.stringify(true));\n      }, 50 * 1000)\n    }\n    span.onclick = function() {\n      modal.style.display = &quot;none&quot;;\n    }\n    window.onclick = function(event) {\n      if (event.target == modal) {\n        modal.style.display = &quot;none&quot;;\n      }\n    }\n    function popupNewsletter() {\n      modal.style.display = &quot;block&quot;;\n    }\n    function onSkipForNow() {\n      window.localStorage.setItem('poped', JSON.stringify(false));\n      modal.style.display = &quot;none&quot;;\n    }\n  &lt;/script&gt;\n&lt;/footer&gt;";

    document.getElementById('html-form').innerHTML = text;
</script>
