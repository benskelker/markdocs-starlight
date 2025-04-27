// AUTO-GENERATED — do not edit.
module.exports = {
  "extends": [
    {
      "nodes": {
        "fence": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight-markdoc/components",
            "namedExport": "Code"
          },
          "attributes": {
            "content": {
              "required": true,
              "render": "code"
            },
            "language": {
              "required": false,
              "render": "lang"
            },
            "frame": {
              "required": false,
              "default": "auto",
              "matches": [
                "auto",
                "code",
                "terminal",
                "none"
              ]
            },
            "meta": {
              "required": false
            },
            "title": {
              "required": false
            }
          }
        },
        "heading": {
          "children": [
            "inline"
          ],
          "attributes": {
            "id": {},
            "level": {
              "required": true,
              "default": 1
            }
          },
          "render": {
            "type": "package",
            "path": "@astrojs/starlight-markdoc/components",
            "namedExport": "Heading"
          }
        }
      },
      "tags": {
        "aside": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Aside"
          },
          "attributes": {
            "title": {
              "required": false
            },
            "type": {
              "required": false,
              "default": "note",
              "matches": [
                "note",
                "danger",
                "caution",
                "tip"
              ]
            }
          }
        },
        "badge": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Badge"
          },
          "attributes": {
            "class": {},
            "dir": {
              "matches": [
                "ltr",
                "rtl",
                "auto"
              ]
            },
            "hidden": {
              "matches": [
                "",
                "hidden",
                "until-found"
              ]
            },
            "id": {},
            "lang": {},
            "role": {},
            "style": {},
            "title": {},
            "text": {
              "required": true
            },
            "size": {
              "required": false,
              "default": "small",
              "matches": [
                "small",
                "medium",
                "large"
              ]
            },
            "variant": {
              "required": false,
              "matches": [
                "note",
                "tip",
                "danger",
                "caution",
                "success"
              ]
            }
          }
        },
        "card": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Card"
          },
          "attributes": {
            "icon": {
              "required": false
            },
            "title": {
              "required": true
            }
          }
        },
        "cardgrid": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "CardGrid"
          },
          "attributes": {
            "stagger": {
              "required": false,
              "default": false
            }
          }
        },
        "code": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Code"
          },
          "attributes": {
            "class": {
              "required": false
            },
            "code": {
              "required": true
            },
            "hangingIndent": {
              "required": false
            },
            "lang": {
              "required": false
            },
            "meta": {
              "required": false
            },
            "locale": {
              "required": false
            },
            "frame": {
              "required": false,
              "default": "auto",
              "matches": [
                "auto",
                "code",
                "terminal",
                "none"
              ]
            },
            "preserveIndent": {
              "required": false,
              "default": true
            },
            "title": {
              "required": false
            },
            "useDiffSyntax": {
              "required": false,
              "default": false
            },
            "wrap": {
              "required": false,
              "default": false
            }
          }
        },
        "filetree": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "FileTree"
          },
          "attributes": {}
        },
        "icon": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Icon"
          },
          "attributes": {
            "class": {
              "required": false
            },
            "color": {
              "required": false
            },
            "label": {
              "required": false
            },
            "name": {
              "required": true
            },
            "size": {
              "required": false
            }
          }
        },
        "linkbutton": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "LinkButton"
          },
          "attributes": {
            "class": {},
            "dir": {
              "matches": [
                "ltr",
                "rtl",
                "auto"
              ]
            },
            "hidden": {
              "matches": [
                "",
                "hidden",
                "until-found"
              ]
            },
            "id": {},
            "lang": {},
            "role": {},
            "style": {},
            "title": {},
            "download": {},
            "href": {
              "required": true
            },
            "hreflang": {},
            "media": {},
            "ping": {},
            "rel": {},
            "target": {
              "matches": [
                "_self",
                "_blank",
                "_parent",
                "_top"
              ]
            },
            "icon": {
              "required": false
            },
            "iconPlacement": {
              "required": false,
              "default": "end",
              "matches": [
                "start",
                "end"
              ]
            },
            "variant": {
              "required": false,
              "default": "primary",
              "matches": [
                "primary",
                "secondary",
                "minimal"
              ]
            }
          }
        },
        "linkcard": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "LinkCard"
          },
          "attributes": {
            "class": {},
            "dir": {
              "matches": [
                "ltr",
                "rtl",
                "auto"
              ]
            },
            "hidden": {
              "matches": [
                "",
                "hidden",
                "until-found"
              ]
            },
            "id": {},
            "lang": {},
            "role": {},
            "style": {},
            "title": {
              "required": true
            },
            "download": {},
            "href": {
              "required": true
            },
            "hreflang": {},
            "media": {},
            "ping": {},
            "rel": {},
            "target": {
              "matches": [
                "_self",
                "_blank",
                "_parent",
                "_top"
              ]
            },
            "description": {
              "required": false
            }
          }
        },
        "steps": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Steps"
          },
          "attributes": {}
        },
        "tabitem": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "TabItem"
          },
          "attributes": {
            "icon": {
              "required": false
            },
            "label": {
              "required": true
            }
          }
        },
        "tabs": {
          "render": {
            "type": "package",
            "path": "@astrojs/starlight/components",
            "namedExport": "Tabs"
          },
          "attributes": {
            "syncKey": {
              "required": false
            }
          }
        }
      }
    }
  ],
  "variables": {
    "product": {
      "name": "SCA",
      "company": "CA"
    }
  }
};
