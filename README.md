# Redentic's Tweaks Repository
![GitHub language count](https://img.shields.io/github/languages/count/RedenticDev/Repo)
![Lines of code](https://img.shields.io/tokei/lines/github/RedenticDev/Repo)
![GitHub repo size](https://img.shields.io/github/repo-size/RedenticDev/Repo)
![W3C Validation](https://img.shields.io/w3c-validation/default?targetUrl=https%3A%2F%2Fredentic.dev)
![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Fredentic.dev)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/RedenticDev/Repo)

This repo has been made with [Maxwell Dausch's tutorial](https://github.com/MDausch/Example-Cydia-Repository) and improved with the help of [Litten's Repo](https://github.com/schneelittchen/Repository). Security improvements from [Doregon's tutorial](https://github.com/Doregon/signing-apt-repo-faq).  
All the redesigns and improvements since its creation have been done by myself. Feel free to take whatever you want from it!

## Features
- Supports all package managers with all their features
- Elegant and responsive website, supporting dark mode & Safari 15
- Automation features thanks to GitHub Actions
- GPG securities to ensure content integrity
- Open source to help you building your repo, and open to contribution

## URLs
This repo is available at [redentic.dev](https://redentic.dev).

## How to add it in my package manager?
Browse [redentic.dev](https://redentic.dev) and click icons to add it to your favorite package manager from your i(Pad)OS device.

## Tweaks & Themes included
Tweaks (& themes) I do are and will always be free and open-source. Here they are:

Tweak | Version | Description | Compatibility
:---:|:---:|:---:|:---:
**[SBColors](https://github.com/RedenticDev/SBColors)** | v1.0.1 | Easily change your status bar colors! | iOS 11.0 - 13.5
**[FastLPM](https://github.com/RedenticDev/FastLPM)** | v1.1.3 | Toggle LPM by tapping the battery icon | iOS 11.0 - 13.7
**Redentic's Respring Pack** | v1.2.0 | A free respring pack with fun icons | iOS 11.0 - 14.4
**[AppMore](https://github.com/RedenticDev/AppMore)** | v1.0.0 | Auto-extend app's description in AppStore updates page | iOS 13.0 - 13.7
**Star Wars Respring Pack** | v1.1.0 | A nice Star Wars respring pack | iOS 11.0 - 14.4

Tweaks on other repos:
Repo | Tweak | Version | Description | Compatibility
:---:|:---:|:---:|:---:|:---:
[Dynastic Repo](https://repo.dynastic.co/package/shortlook-telegram) | **[ShortLook-Telegram](https://github.com/RedenticDev/ShortLook-Telegram)** | v1.1.0 | Show Telegram Contact Photos in ShortLook when you receive a Telegram notification! | iOS 11.0 - 14.7.1

---
<details>
  <summary><strong>Public key: </strong><a href="https://github.com/RedenticDev/Repo/files/6986250/redentic-repo.gpg.zip">redentic-repo.gpg.zip</a> <em>(Click for usage)</em></summary>
  <br/>
  Here is how to use a public GPG key for a Cydia repository:
  <ol>
    <li>Download and unzip the key</li>
    <li>
      On iOS:
      <ul>
        <li>Move it to <code>/etc/apt/trusted.gpg.d/</code></li>
      </ul>
      On macOS:
      <ul>
        <li>Install <a href="https://github.com/ProcursusTeam/Procursus/wiki/Building-on-iOS-and-macOS" target="_blank">Procursus</a></li>
        <li>Move the key to <code>/opt/procursus/etc/apt/trusted.gpg.d/</code></li>
      </ul>
    </li>
    <li>Refresh your sources, no error should occur. If there is any, there might be a security issue.<br />Please report me if any <em>GPG error</em> occurs, like <code>BADSIG</code> or <code>NO_PUBKEY</code>.</li>
  </ol>
  <blockquote>Note: My key (this file) is already included in Procursus keyring, refreshing your sources in Sileo should be the only step needed.</blockquote>
</details>
