

# eCompta



## Usage
# Web shot: https://github.com/brenden/node-webshot


## Lancer Application
Lancer application: supervisor -e 'html|js' node app.js
Mettre a jour libraire:
1/ajouter librairie ds package.json
2/lancer: npm update

## Lancer Base de données
bin/mongod --dbpath data/db/
test3

## Manipuler Base de données
bin/mongo

use echristmas

db.cadeaux.find()
## Mise a jour des Cadeaux
db.cadeaux.update({owner: null}, {$set: { owner: "Florent" }})

## Mise a jour des Users with Account
db.users.update({account: null}, {$set: { account: "chardon" }})


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.




div.btn-group(is-open="status.isopen", uib-dropdown="")
			button.btn.btn-primary(id="single-button", type="button", uib-dropdown-toggle, ng-disabled="disabled") Button dropdown
				span.caret
			ul.uib-dropdown-menu(role="menu",aria-labelledby="single-button")
				li(role="menuitem")
					a(href="#")	Action
					
						span(on-toggle="toggled(open)", uib-dropdown="") {{test}}
			a(id="simple-dropdown", uib-dropdown-toggle="") Click me for a dropdown, yo! {{test}}
		