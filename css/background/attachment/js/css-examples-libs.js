var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = function(e) {
        var t = /\blang(?:uage)?-([\w-]+)\b/i,
            n = 0,
            r = {
                manual: e.Prism && e.Prism.manual,
                disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
                util: {
                    encode: function(e) {
                        return e instanceof i ? new i(e.type, r.util.encode(e.content), e.alias) : Array.isArray(e) ? e.map(r.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                    },
                    type: function(e) {
                        return Object.prototype.toString.call(e).slice(8, -1)
                    },
                    objId: function(e) {
                        return e.__id || Object.defineProperty(e, "__id", {
                            value: ++n
                        }), e.__id
                    },
                    clone: function e(t, n) {
                        var i, a, o = r.util.type(t);
                        switch (n = n || {}, o) {
                            case "Object":
                                if (a = r.util.objId(t), n[a]) return n[a];
                                for (var s in i = {}, n[a] = i, t) t.hasOwnProperty(s) && (i[s] = e(t[s], n));
                                return i;
                            case "Array":
                                return a = r.util.objId(t), n[a] ? n[a] : (i = [], n[a] = i, t.forEach(function(t, r) {
                                    i[r] = e(t, n)
                                }), i);
                            default:
                                return t
                        }
                    },
                    getLanguage: function(e) {
                        for (; e && !t.test(e.className);) e = e.parentElement;
                        return e ? (e.className.match(t) || [, "none"])[1].toLowerCase() : "none"
                    },
                    currentScript: function() {
                        if ("undefined" == typeof document) return null;
                        if ("currentScript" in document) return document.currentScript;
                        try {
                            throw new Error
                        } catch (r) {
                            var e = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(r.stack) || [])[1];
                            if (e) {
                                var t = document.getElementsByTagName("script");
                                for (var n in t)
                                    if (t[n].src == e) return t[n]
                            }
                            return null
                        }
                    }
                },
                languages: {
                    extend: function(e, t) {
                        var n = r.util.clone(r.languages[e]);
                        for (var i in t) n[i] = t[i];
                        return n
                    },
                    insertBefore: function(e, t, n, i) {
                        var a = (i = i || r.languages)[e],
                            o = {};
                        for (var s in a)
                            if (a.hasOwnProperty(s)) {
                                if (s == t)
                                    for (var l in n) n.hasOwnProperty(l) && (o[l] = n[l]);
                                n.hasOwnProperty(s) || (o[s] = a[s])
                            }
                        var u = i[e];
                        return i[e] = o, r.languages.DFS(r.languages, function(t, n) {
                            n === u && t != e && (this[t] = o)
                        }), o
                    },
                    DFS: function e(t, n, i, a) {
                        a = a || {};
                        var o = r.util.objId;
                        for (var s in t)
                            if (t.hasOwnProperty(s)) {
                                n.call(t, s, t[s], i || s);
                                var l = t[s],
                                    u = r.util.type(l);
                                "Object" !== u || a[o(l)] ? "Array" !== u || a[o(l)] || (a[o(l)] = !0, e(l, n, s, a)) : (a[o(l)] = !0, e(l, n, null, a))
                            }
                    }
                },
                plugins: {},
                highlightAll: function(e, t) {
                    r.highlightAllUnder(document, e, t)
                },
                highlightAllUnder: function(e, t, n) {
                    var i = {
                        callback: n,
                        container: e,
                        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                    };
                    r.hooks.run("before-highlightall", i), i.elements = Array.prototype.slice.apply(i.container.querySelectorAll(i.selector)), r.hooks.run("before-all-elements-highlight", i);
                    for (var a, o = 0; a = i.elements[o++];) r.highlightElement(a, !0 === t, i.callback)
                },
                highlightElement: function(n, i, a) {
                    var o = r.util.getLanguage(n),
                        s = r.languages[o];
                    n.className = n.className.replace(t, "").replace(/\s+/g, " ") + " language-" + o;
                    var l = n.parentNode;
                    l && "pre" === l.nodeName.toLowerCase() && (l.className = l.className.replace(t, "").replace(/\s+/g, " ") + " language-" + o);
                    var u = {
                        element: n,
                        language: o,
                        grammar: s,
                        code: n.textContent
                    };

                    function c(e) {
                        u.highlightedCode = e, r.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, r.hooks.run("after-highlight", u), r.hooks.run("complete", u), a && a.call(u.element)
                    }
                    if (r.hooks.run("before-sanity-check", u), !u.code) return r.hooks.run("complete", u), void(a && a.call(u.element));
                    if (r.hooks.run("before-highlight", u), u.grammar)
                        if (i && e.Worker) {
                            var f = new Worker(r.filename);
                            f.onmessage = function(e) {
                                c(e.data)
                            }, f.postMessage(JSON.stringify({
                                language: u.language,
                                code: u.code,
                                immediateClose: !0
                            }))
                        } else c(r.highlight(u.code, u.grammar, u.language));
                    else c(r.util.encode(u.code))
                },
                highlight: function(e, t, n) {
                    var a = {
                        code: e,
                        grammar: t,
                        language: n
                    };
                    return r.hooks.run("before-tokenize", a), a.tokens = r.tokenize(a.code, a.grammar), r.hooks.run("after-tokenize", a), i.stringify(r.util.encode(a.tokens), a.language)
                },
                matchGrammar: function(e, t, n, a, o, s, l) {
                    for (var u in n)
                        if (n.hasOwnProperty(u) && n[u]) {
                            var c = n[u];
                            c = Array.isArray(c) ? c : [c];
                            for (var f = 0; f < c.length; ++f) {
                                if (l && l == u + "," + f) return;
                                var d = c[f],
                                    p = d.inside,
                                    g = !!d.lookbehind,
                                    h = !!d.greedy,
                                    m = 0,
                                    y = d.alias;
                                if (h && !d.pattern.global) {
                                    var v = d.pattern.toString().match(/[imsuy]*$/)[0];
                                    d.pattern = RegExp(d.pattern.source, v + "g")
                                }
                                d = d.pattern || d;
                                for (var b = a, k = o; b < t.length; k += t[b].length, ++b) {
                                    var w = t[b];
                                    if (t.length > e.length) return;
                                    if (!(w instanceof i)) {
                                        if (h && b != t.length - 1) {
                                            if (d.lastIndex = k, !(P = d.exec(e))) break;
                                            for (var x = P.index + (g && P[1] ? P[1].length : 0), F = P.index + P[0].length, A = b, S = k, E = t.length; A < E && (S < F || !t[A].type && !t[A - 1].greedy); ++A) x >= (S += t[A].length) && (++b, k = S);
                                            if (t[b] instanceof i) continue;
                                            _ = A - b, w = e.slice(k, S), P.index -= k
                                        } else {
                                            d.lastIndex = 0;
                                            var P = d.exec(w),
                                                _ = 1
                                        }
                                        if (P) {
                                            g && (m = P[1] ? P[1].length : 0);
                                            F = (x = P.index + m) + (P = P[0].slice(m)).length;
                                            var T = w.slice(0, x),
                                                C = w.slice(F),
                                                j = [b, _];
                                            T && (++b, k += T.length, j.push(T));
                                            var $ = new i(u, p ? r.tokenize(P, p) : P, y, P, h);
                                            if (j.push($), C && j.push(C), Array.prototype.splice.apply(t, j), 1 != _ && r.matchGrammar(e, t, n, b, k, !0, u + "," + f), s) break
                                        } else if (s) break
                                    }
                                }
                            }
                        }
                },
                tokenize: function(e, t) {
                    var n = [e],
                        i = t.rest;
                    if (i) {
                        for (var a in i) t[a] = i[a];
                        delete t.rest
                    }
                    return r.matchGrammar(e, n, t, 0, 0, !1), n
                },
                hooks: {
                    all: {},
                    add: function(e, t) {
                        var n = r.hooks.all;
                        n[e] = n[e] || [], n[e].push(t)
                    },
                    run: function(e, t) {
                        var n = r.hooks.all[e];
                        if (n && n.length)
                            for (var i, a = 0; i = n[a++];) i(t)
                    }
                },
                Token: i
            };

        function i(e, t, n, r, i) {
            this.type = e, this.content = t, this.alias = n, this.length = 0 | (r || "").length, this.greedy = !!i
        }
        if (e.Prism = r, i.stringify = function(e, t) {
                if ("string" == typeof e) return e;
                if (Array.isArray(e)) return e.map(function(e) {
                    return i.stringify(e, t)
                }).join("");
                var n = {
                    type: e.type,
                    content: i.stringify(e.content, t),
                    tag: "span",
                    classes: ["token", e.type],
                    attributes: {},
                    language: t
                };
                if (e.alias) {
                    var a = Array.isArray(e.alias) ? e.alias : [e.alias];
                    Array.prototype.push.apply(n.classes, a)
                }
                r.hooks.run("wrap", n);
                var o = Object.keys(n.attributes).map(function(e) {
                    return e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
                }).join(" ");
                return "<" + n.tag + ' class="' + n.classes.join(" ") + '"' + (o ? " " + o : "") + ">" + n.content + "</" + n.tag + ">"
            }, !e.document) return e.addEventListener ? (r.disableWorkerMessageHandler || e.addEventListener("message", function(t) {
            var n = JSON.parse(t.data),
                i = n.language,
                a = n.code,
                o = n.immediateClose;
            e.postMessage(r.highlight(a, r.languages[i], i)), o && e.close()
        }, !1), r) : r;
        var a = r.util.currentScript();
        if (a && (r.filename = a.src, a.hasAttribute("data-manual") && (r.manual = !0)), !r.manual) {
            function o() {
                r.manual || r.highlightAll()
            }
            var s = document.readyState;
            "loading" === s || "interactive" === s && a && a.defer ? document.addEventListener("DOMContentLoaded", o) : window.requestAnimationFrame ? window.requestAnimationFrame(o) : window.setTimeout(o, 16)
        }
        return r
    }(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism), Prism.languages.markup = {
        comment: /<!--[\s\S]*?-->/,
        prolog: /<\?[\s\S]+?\?>/,
        doctype: {
            pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
            greedy: !0
        },
        cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
        tag: {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
            greedy: !0,
            inside: {
                tag: {
                    pattern: /^<\/?[^\s>\/]+/i,
                    inside: {
                        punctuation: /^<\/?/,
                        namespace: /^[^\s>\/:]+:/
                    }
                },
                "attr-value": {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
                    inside: {
                        punctuation: [/^=/, {
                            pattern: /^(\s*)["']|["']$/,
                            lookbehind: !0
                        }]
                    }
                },
                punctuation: /\/?>/,
                "attr-name": {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        namespace: /^[^\s>\/:]+:/
                    }
                }
            }
        },
        entity: /&#?[\da-z]{1,8};/i
    }, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function(e) {
        "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"))
    }), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
        value: function(e, t) {
            var n = {};
            n["language-" + t] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: !0,
                inside: Prism.languages[t]
            }, n.cdata = /^<!\[CDATA\[|\]\]>$/i;
            var r = {
                "included-cdata": {
                    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                    inside: n
                }
            };
            r["language-" + t] = {
                pattern: /[\s\S]+/,
                inside: Prism.languages[t]
            };
            var i = {};
            i[e] = {
                pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, e), "i"),
                lookbehind: !0,
                greedy: !0,
                inside: r
            }, Prism.languages.insertBefore("markup", "cdata", i)
        }
    }), Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup,
    function(e) {
        var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
        e.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
                inside: {
                    rule: /@[\w-]+/
                }
            },
            url: {
                pattern: RegExp("url\\((?:" + t.source + "|[^\n\r()]*)\\)", "i"),
                inside: {
                    function: /^url/i,
                    punctuation: /^\(|\)$/
                }
            },
            selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
            string: {
                pattern: t,
                greedy: !0
            },
            property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
            important: /!important\b/i,
            function: /[-a-z0-9]+(?=\()/i,
            punctuation: /[(){};:,]/
        }, e.languages.css.atrule.inside.rest = e.languages.css;
        var n = e.languages.markup;
        n && (n.tag.addInlined("style", "css"), e.languages.insertBefore("inside", "attr-value", {
            "style-attr": {
                pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                inside: {
                    "attr-name": {
                        pattern: /^\s*style/i,
                        inside: n.tag.inside
                    },
                    punctuation: /^\s*=\s*['"]|['"]\s*$/,
                    "attr-value": {
                        pattern: /.+/i,
                        inside: e.languages.css
                    }
                },
                alias: "language-css"
            }
        }, n.tag))
    }(Prism), Prism.languages.clike = {
        comment: [{
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: !0
        }, {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: !0,
            greedy: !0
        }],
        string: {
            pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: !0
        },
        "class-name": {
            pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: !0,
            inside: {
                punctuation: /[.\\]/
            }
        },
        keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
        boolean: /\b(?:true|false)\b/,
        function: /\w+(?=\()/,
        number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
        operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        punctuation: /[{}[\];(),.:]/
    }, Prism.languages.javascript = Prism.languages.extend("clike", {
        "class-name": [Prism.languages.clike["class-name"], {
            pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
            lookbehind: !0
        }],
        keyword: [{
            pattern: /((?:^|})\s*)(?:catch|finally)\b/,
            lookbehind: !0
        }, {
            pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: !0
        }],
        number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
        function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        operator: /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
    }), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
            lookbehind: !0,
            greedy: !0
        },
        "function-variable": {
            pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
            alias: "function"
        },
        parameter: [{
            pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
            lookbehind: !0,
            inside: Prism.languages.javascript
        }, {
            pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
            inside: Prism.languages.javascript
        }, {
            pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
            lookbehind: !0,
            inside: Prism.languages.javascript
        }, {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
            lookbehind: !0,
            inside: Prism.languages.javascript
        }],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }), Prism.languages.insertBefore("javascript", "string", {
        "template-string": {
            pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
            greedy: !0,
            inside: {
                "template-punctuation": {
                    pattern: /^`|`$/,
                    alias: "string"
                },
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                    lookbehind: !0,
                    inside: {
                        "interpolation-punctuation": {
                            pattern: /^\${|}$/,
                            alias: "punctuation"
                        },
                        rest: Prism.languages.javascript
                    }
                },
                string: /[\s\S]+/
            }
        }
    }), Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.js = Prism.languages.javascript,
    function() {
        if ("undefined" != typeof self && self.Prism && self.document) {
            var e = /\n(?!$)/g,
                t = function(t) {
                    var r = n(t)["white-space"];
                    if ("pre-wrap" === r || "pre-line" === r) {
                        var i = t.querySelector("code"),
                            a = t.querySelector(".line-numbers-rows"),
                            o = t.querySelector(".line-numbers-sizer"),
                            s = i.textContent.split(e);
                        o || ((o = document.createElement("span")).className = "line-numbers-sizer", i.appendChild(o)), o.style.display = "block", s.forEach(function(e, t) {
                            o.textContent = e || "\n";
                            var n = o.getBoundingClientRect().height;
                            a.children[t].style.height = n + "px"
                        }), o.textContent = "", o.style.display = "none"
                    }
                },
                n = function(e) {
                    return e ? window.getComputedStyle ? getComputedStyle(e) : e.currentStyle || null : null
                };
            window.addEventListener("resize", function() {
                Array.prototype.forEach.call(document.querySelectorAll("pre.line-numbers"), t)
            }), Prism.hooks.add("complete", function(n) {
                if (n.code) {
                    var r = n.element,
                        i = r.parentNode;
                    if (i && /pre/i.test(i.nodeName) && !r.querySelector(".line-numbers-rows")) {
                        for (var a = !1, o = /(?:^|\s)line-numbers(?:\s|$)/, s = r; s; s = s.parentNode)
                            if (o.test(s.className)) {
                                a = !0;
                                break
                            }
                        if (a) {
                            r.className = r.className.replace(o, " "), o.test(i.className) || (i.className += " line-numbers");
                            var l, u = n.code.match(e),
                                c = u ? u.length + 1 : 1,
                                f = new Array(c + 1).join("<span></span>");
                            (l = document.createElement("span")).setAttribute("aria-hidden", "true"), l.className = "line-numbers-rows", l.innerHTML = f, i.hasAttribute("data-start") && (i.style.counterReset = "linenumber " + (parseInt(i.getAttribute("data-start"), 10) - 1)), n.element.appendChild(l), t(i), Prism.hooks.run("line-numbers", n)
                        }
                    }
                }
            }), Prism.hooks.add("line-numbers", function(e) {
                e.plugins = e.plugins || {}, e.plugins.lineNumbers = !0
            }), Prism.plugins.lineNumbers = {
                getLine: function(e, t) {
                    if ("PRE" === e.tagName && e.classList.contains("line-numbers")) {
                        var n = e.querySelector(".line-numbers-rows"),
                            r = parseInt(e.getAttribute("data-start"), 10) || 1,
                            i = r + (n.children.length - 1);
                        t < r && (t = r), t > i && (t = i);
                        var a = t - r;
                        return n.children[a]
                    }
                }
            }
        }
    }(),
    function(e) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
        else if ("function" == typeof define && define.amd) define([], e);
        else {
            ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Clipboard = e()
        }
    }(function() {
        return function e(t, n, r) {
            function i(o, s) {
                if (!n[o]) {
                    if (!t[o]) {
                        var l = "function" == typeof require && require;
                        if (!s && l) return l(o, !0);
                        if (a) return a(o, !0);
                        var u = new Error("Cannot find module '" + o + "'");
                        throw u.code = "MODULE_NOT_FOUND", u
                    }
                    var c = n[o] = {
                        exports: {}
                    };
                    t[o][0].call(c.exports, function(e) {
                        var n = t[o][1][e];
                        return i(n || e)
                    }, c, c.exports, e, t, n, r)
                }
                return n[o].exports
            }
            for (var a = "function" == typeof require && require, o = 0; o < r.length; o++) i(r[o]);
            return i
        }({
            1: [function(e, t, n) {
                var r = 9;
                if ("undefined" != typeof Element && !Element.prototype.matches) {
                    var i = Element.prototype;
                    i.matches = i.matchesSelector || i.mozMatchesSelector || i.msMatchesSelector || i.oMatchesSelector || i.webkitMatchesSelector
                }
                t.exports = function(e, t) {
                    for (; e && e.nodeType !== r;) {
                        if ("function" == typeof e.matches && e.matches(t)) return e;
                        e = e.parentNode
                    }
                }
            }, {}],
            2: [function(e, t, n) {
                var r = e("./closest");
                t.exports = function(e, t, n, i, a) {
                    var o = function(e, t, n, i) {
                        return function(n) {
                            n.delegateTarget = r(n.target, t), n.delegateTarget && i.call(e, n)
                        }
                    }.apply(this, arguments);
                    return e.addEventListener(n, o, a), {
                        destroy: function() {
                            e.removeEventListener(n, o, a)
                        }
                    }
                }
            }, {
                "./closest": 1
            }],
            3: [function(e, t, n) {
                n.node = function(e) {
                    return void 0 !== e && e instanceof HTMLElement && 1 === e.nodeType
                }, n.nodeList = function(e) {
                    var t = Object.prototype.toString.call(e);
                    return void 0 !== e && ("[object NodeList]" === t || "[object HTMLCollection]" === t) && "length" in e && (0 === e.length || n.node(e[0]))
                }, n.string = function(e) {
                    return "string" == typeof e || e instanceof String
                }, n.fn = function(e) {
                    return "[object Function]" === Object.prototype.toString.call(e)
                }
            }, {}],
            4: [function(e, t, n) {
                var r = e("./is"),
                    i = e("delegate");
                t.exports = function(e, t, n) {
                    if (!e && !t && !n) throw new Error("Missing required arguments");
                    if (!r.string(t)) throw new TypeError("Second argument must be a String");
                    if (!r.fn(n)) throw new TypeError("Third argument must be a Function");
                    if (r.node(e)) return function(e, t, n) {
                        return e.addEventListener(t, n), {
                            destroy: function() {
                                e.removeEventListener(t, n)
                            }
                        }
                    }(e, t, n);
                    if (r.nodeList(e)) return function(e, t, n) {
                        return Array.prototype.forEach.call(e, function(e) {
                            e.addEventListener(t, n)
                        }), {
                            destroy: function() {
                                Array.prototype.forEach.call(e, function(e) {
                                    e.removeEventListener(t, n)
                                })
                            }
                        }
                    }(e, t, n);
                    if (r.string(e)) return function(e, t, n) {
                        return i(document.body, e, t, n)
                    }(e, t, n);
                    throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
                }
            }, {
                "./is": 3,
                delegate: 2
            }],
            5: [function(e, t, n) {
                t.exports = function(e) {
                    var t;
                    if ("SELECT" === e.nodeName) e.focus(), t = e.value;
                    else if ("INPUT" === e.nodeName || "TEXTAREA" === e.nodeName) {
                        var n = e.hasAttribute("readonly");
                        n || e.setAttribute("readonly", ""), e.select(), e.setSelectionRange(0, e.value.length), n || e.removeAttribute("readonly"), t = e.value
                    } else {
                        e.hasAttribute("contenteditable") && e.focus();
                        var r = window.getSelection(),
                            i = document.createRange();
                        i.selectNodeContents(e), r.removeAllRanges(), r.addRange(i), t = r.toString()
                    }
                    return t
                }
            }, {}],
            6: [function(e, t, n) {
                function r() {}
                r.prototype = {
                    on: function(e, t, n) {
                        var r = this.e || (this.e = {});
                        return (r[e] || (r[e] = [])).push({
                            fn: t,
                            ctx: n
                        }), this
                    },
                    once: function(e, t, n) {
                        var r = this;

                        function i() {
                            r.off(e, i), t.apply(n, arguments)
                        }
                        return i._ = t, this.on(e, i, n)
                    },
                    emit: function(e) {
                        for (var t = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[e] || []).slice(), r = 0, i = n.length; r < i; r++) n[r].fn.apply(n[r].ctx, t);
                        return this
                    },
                    off: function(e, t) {
                        var n = this.e || (this.e = {}),
                            r = n[e],
                            i = [];
                        if (r && t)
                            for (var a = 0, o = r.length; a < o; a++) r[a].fn !== t && r[a].fn._ !== t && i.push(r[a]);
                        return i.length ? n[e] = i : delete n[e], this
                    }
                }, t.exports = r
            }, {}],
            7: [function(e, t, n) {
                ! function(r, i) {
                    if (void 0 !== n) i(t, e("select"));
                    else {
                        var a = {
                            exports: {}
                        };
                        i(a, r.select), r.clipboardAction = a.exports
                    }
                }(this, function(e, t) {
                    "use strict";
                    var n, r = (n = t) && n.__esModule ? n : {
                        default: n
                    };
                    var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                        return typeof e
                    } : function(e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    };
                    var a = function() {
                            function e(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var r = t[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                                }
                            }
                            return function(t, n, r) {
                                return n && e(t.prototype, n), r && e(t, r), t
                            }
                        }(),
                        o = function() {
                            function e(t) {
                                ! function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, e), this.resolveOptions(t), this.initSelection()
                            }
                            return a(e, [{
                                key: "resolveOptions",
                                value: function() {
                                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                    this.action = e.action, this.container = e.container, this.emitter = e.emitter, this.target = e.target, this.text = e.text, this.trigger = e.trigger, this.selectedText = ""
                                }
                            }, {
                                key: "initSelection",
                                value: function() {
                                    this.text ? this.selectFake() : this.target && this.selectTarget()
                                }
                            }, {
                                key: "selectFake",
                                value: function() {
                                    var e = this,
                                        t = "rtl" == document.documentElement.getAttribute("dir");
                                    this.removeFake(), this.fakeHandlerCallback = function() {
                                        return e.removeFake()
                                    }, this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || !0, this.fakeElem = document.createElement("textarea"), this.fakeElem.style.fontSize = "12pt", this.fakeElem.style.border = "0", this.fakeElem.style.padding = "0", this.fakeElem.style.margin = "0", this.fakeElem.style.position = "absolute", this.fakeElem.style[t ? "right" : "left"] = "-9999px";
                                    var n = window.pageYOffset || document.documentElement.scrollTop;
                                    this.fakeElem.style.top = n + "px", this.fakeElem.setAttribute("readonly", ""), this.fakeElem.value = this.text, this.container.appendChild(this.fakeElem), this.selectedText = (0, r.default)(this.fakeElem), this.copyText()
                                }
                            }, {
                                key: "removeFake",
                                value: function() {
                                    this.fakeHandler && (this.container.removeEventListener("click", this.fakeHandlerCallback), this.fakeHandler = null, this.fakeHandlerCallback = null), this.fakeElem && (this.container.removeChild(this.fakeElem), this.fakeElem = null)
                                }
                            }, {
                                key: "selectTarget",
                                value: function() {
                                    this.selectedText = (0, r.default)(this.target), this.copyText()
                                }
                            }, {
                                key: "copyText",
                                value: function() {
                                    var e = void 0;
                                    try {
                                        e = document.execCommand(this.action)
                                    } catch (t) {
                                        e = !1
                                    }
                                    this.handleResult(e)
                                }
                            }, {
                                key: "handleResult",
                                value: function(e) {
                                    this.emitter.emit(e ? "success" : "error", {
                                        action: this.action,
                                        text: this.selectedText,
                                        trigger: this.trigger,
                                        clearSelection: this.clearSelection.bind(this)
                                    })
                                }
                            }, {
                                key: "clearSelection",
                                value: function() {
                                    this.trigger && this.trigger.focus(), window.getSelection().removeAllRanges()
                                }
                            }, {
                                key: "destroy",
                                value: function() {
                                    this.removeFake()
                                }
                            }, {
                                key: "action",
                                set: function() {
                                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "copy";
                                    if (this._action = e, "copy" !== this._action && "cut" !== this._action) throw new Error('Invalid "action" value, use either "copy" or "cut"')
                                },
                                get: function() {
                                    return this._action
                                }
                            }, {
                                key: "target",
                                set: function(e) {
                                    if (void 0 !== e) {
                                        if (!e || "object" !== (void 0 === e ? "undefined" : i(e)) || 1 !== e.nodeType) throw new Error('Invalid "target" value, use a valid Element');
                                        if ("copy" === this.action && e.hasAttribute("disabled")) throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                        if ("cut" === this.action && (e.hasAttribute("readonly") || e.hasAttribute("disabled"))) throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                        this._target = e
                                    }
                                },
                                get: function() {
                                    return this._target
                                }
                            }]), e
                        }();
                    e.exports = o
                })
            }, {
                select: 5
            }],
            8: [function(e, t, n) {
                ! function(r, i) {
                    if (void 0 !== n) i(t, e("./clipboard-action"), e("tiny-emitter"), e("good-listener"));
                    else {
                        var a = {
                            exports: {}
                        };
                        i(a, r.clipboardAction, r.tinyEmitter, r.goodListener), r.clipboard = a.exports
                    }
                }(this, function(e, t, n, r) {
                    "use strict";
                    var i = s(t),
                        a = s(n),
                        o = s(r);

                    function s(e) {
                        return e && e.__esModule ? e : {
                            default: e
                        }
                    }
                    var l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                        return typeof e
                    } : function(e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    };
                    var u = function() {
                        function e(e, t) {
                            for (var n = 0; n < t.length; n++) {
                                var r = t[n];
                                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                            }
                        }
                        return function(t, n, r) {
                            return n && e(t.prototype, n), r && e(t, r), t
                        }
                    }();
                    var c = function(e) {
                        function t(e, n) {
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, t);
                            var r = function(e, t) {
                                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return !t || "object" != typeof t && "function" != typeof t ? e : t
                            }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                            return r.resolveOptions(n), r.listenClick(e), r
                        }
                        return function(e, t) {
                            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                            e.prototype = Object.create(t && t.prototype, {
                                constructor: {
                                    value: e,
                                    enumerable: !1,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                        }(t, a.default), u(t, [{
                            key: "resolveOptions",
                            value: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                this.action = "function" == typeof e.action ? e.action : this.defaultAction, this.target = "function" == typeof e.target ? e.target : this.defaultTarget, this.text = "function" == typeof e.text ? e.text : this.defaultText, this.container = "object" === l(e.container) ? e.container : document.body
                            }
                        }, {
                            key: "listenClick",
                            value: function(e) {
                                var t = this;
                                this.listener = (0, o.default)(e, "click", function(e) {
                                    return t.onClick(e)
                                })
                            }
                        }, {
                            key: "onClick",
                            value: function(e) {
                                var t = e.delegateTarget || e.currentTarget;
                                this.clipboardAction && (this.clipboardAction = null), this.clipboardAction = new i.default({
                                    action: this.action(t),
                                    target: this.target(t),
                                    text: this.text(t),
                                    container: this.container,
                                    trigger: t,
                                    emitter: this
                                })
                            }
                        }, {
                            key: "defaultAction",
                            value: function(e) {
                                return f("action", e)
                            }
                        }, {
                            key: "defaultTarget",
                            value: function(e) {
                                var t = f("target", e);
                                if (t) return document.querySelector(t)
                            }
                        }, {
                            key: "defaultText",
                            value: function(e) {
                                return f("text", e)
                            }
                        }, {
                            key: "destroy",
                            value: function() {
                                this.listener.destroy(), this.clipboardAction && (this.clipboardAction.destroy(), this.clipboardAction = null)
                            }
                        }], [{
                            key: "isSupported",
                            value: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ["copy", "cut"],
                                    t = "string" == typeof e ? [e] : e,
                                    n = !!document.queryCommandSupported;
                                return t.forEach(function(e) {
                                    n = n && !!document.queryCommandSupported(e)
                                }), n
                            }
                        }]), t
                    }();

                    function f(e, t) {
                        var n = "data-clipboard-" + e;
                        if (t.hasAttribute(n)) return t.getAttribute(n)
                    }
                    e.exports = c
                })
            }, {
                "./clipboard-action": 7,
                "good-listener": 4,
                "tiny-emitter": 6
            }]
        }, {}, [8])(8)
    });