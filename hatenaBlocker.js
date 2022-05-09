// ==UserScript==
// @name         はてなブロッカー
// @namespace    https://next.waterleaper.net/
// @description    はてなブックマークの記事をURLとタイトルを対象にフィルタリングします。
// @version      0.2.4
// @author       waterleaper
// @match        https://b.hatena.ne.jp/*
// @grant        none
// @license MIT
// ==/UserScript==

;(function () {
  "use strict"

  // NGリストを配列で返す
  function getNGList() {
    const inputNgList = localStorage.getItem("inputNgList")
    let inputNgListArray
    if (inputNgList) {
      inputNgListArray = inputNgList.split(",")
    }
    return inputNgListArray
  }

  // NG要素を非表示にする
  function hideNg() {
    const inputNgListArray = getNGList()
    if (inputNgListArray != null) {
      const articles = document.querySelectorAll(".entrylist-image-entry")
      articles.forEach((a) => {
        const link = a.querySelector(".js-keyboard-openable")
        if (link) {
          const titleEle = a.querySelector(".entrylist-contents-title a")
          const title = titleEle.getAttribute("title")
          const href = link.getAttribute("href")
          for (let i = 0; i < inputNgListArray.length; i++) {
            if (href.indexOf(inputNgListArray[i]) !== -1 || title.indexOf(inputNgListArray[i]) !== -1) {
              a.style.display = "none"
            }
          }
        }
      })
    }
  }

  // 入力フォームを挿入
  function addInputForm() {
    const inputBox = document.createElement("div")
    inputBox.setAttribute("id", "inputBox")
    inputBox.setAttribute("style", "position:relative;")
    const newInput = document.createElement("input")
    newInput.setAttribute("id", "inputNg")
    newInput.setAttribute("placeholder", "NGワード・URLを入力")
    newInput.setAttribute("type", "text")
    newInput.setAttribute(
      "style",
      "width: 150px;height: 26px;font-size: 12px;margin: 5px 0 0 30px;border: 1px solid #aaa;"
    )
    const newBtn = document.createElement("button")
    newBtn.setAttribute("id", "inputNgAddBtn")
    newBtn.setAttribute(
      "style",
      "height: 30px;margin: 5px 5px 0;font-size: 12px;"
    )
    newBtn.innerText = "追加"
    inputBox.appendChild(newInput)
    inputBox.appendChild(newBtn)
    const parentEle = document.querySelector(".branding")
    const childEle = document.querySelector(".branding-searchbox")
    parentEle.insertBefore(inputBox, childEle)
  }

  // NG追加
  function addNg() {
    const inputNg = document.getElementById("inputNg").value
    const inputNgList = localStorage.getItem("inputNgList")
    if (inputNgList) {
      const inputNgListArray = inputNgList.split(",")
      if (inputNgListArray.indexOf(inputNg) === -1) {
        localStorage.setItem("inputNgList", inputNgList + "," + inputNg)
      }
    } else {
      localStorage.setItem("inputNgList", inputNg)
    }
    document.getElementById("inputNg").value = ""
    hideNg()
  }

  // 初期化
  function init() {
    addInputForm()
    hideNg()
  }
  init()

  // NG追加ボタンを押した時の処理
  const addNgBtn = document.getElementById("inputNgAddBtn")
  addNgBtn.addEventListener("click", (e) => {
    addNg()
  })

  function hideSelect() {
    const selectNgList = document.getElementById("selectNgList")
    const parentEle = document.getElementById("inputBox")
    if (selectNgList != null) {
      parentEle.removeChild(selectNgList)
    }
  }

  function showSelect() {
    const inputNgListArray = getNGList()
    if (inputNgListArray != null) {
      const ul = document.createElement("ul")
      ul.setAttribute("id", "selectNgList")
      ul.setAttribute("placeholder", "NGワード・URLを入力")
      ul.setAttribute("type", "text")
      ul.setAttribute(
        "style",
        "width: 156px;position: absolute;left: 30px;color: #888;background: #fff;z-index: 9999;"
      )
      for (let i = 0; i < inputNgListArray.length; i++) {
        const li = document.createElement("li")
        li.setAttribute(
          "style",
          "display: flex;justify-content: space-between;align-items: center;border-bottom: 1px solid #888;border-left: 1px solid #888;border-right: 1px solid #888;padding: 3px;"
        )
        const span = document.createElement("span")
        span.setAttribute(
          "style",
          "width: 120px;overflow: hidden;white-space: nowrap;font-size: 12px;"
        )
        span.innerText = inputNgListArray[i]
        const button = document.createElement("button")
        button.setAttribute("class", "ngDelBtn")
        button.setAttribute("data-ng-index", i)
        button.setAttribute(
          "style",
          "margin: 0 5px;border: none;background: rgba(220, 50,50, 0.7);color: white;font-size: 15px;border-radius: 9999px;display: inline-block;width: 20px;height: 20px;line-height: 15px;text-align: center;outline: none;padding: 0;appearance: none;"
        )
        button.innerText = "×"
        li.appendChild(span)
        li.appendChild(button)
        ul.appendChild(li)
      }
      const parentEle = document.getElementById("inputBox")
      parentEle.appendChild(ul)

      document.querySelectorAll(".ngDelBtn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = btn.dataset.ngIndex
          const inputNgListArray = getNGList()
          inputNgListArray.splice(index, 1)
          localStorage.setItem("inputNgList", inputNgListArray)
          setTimeout(() => {
            hideSelect()
          }, 300)
        })
      })
    }
  }

  // NG追加フォームがフォーカスされた時の処理
  const inputNg = document.getElementById("inputNg")
  inputNg.addEventListener("focus", (e) => {
    showSelect()
  })

  // NG追加フォームからフォーカスが外れた時の処理
  inputNg.addEventListener("focusout", (e) => {
    setTimeout(() => {
      hideSelect()
    }, 300)
  })

  // NG追加フォームでEnterを押した時の処理
  inputNg.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      addNg()
      hideSelect()
      showSelect()
    }
  })
})()
