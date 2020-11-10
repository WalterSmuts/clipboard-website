DeployDir = /srv/http/clipboard/
ClipboardDir = /var/clipboard/

deploy: index.html
	mkdir -p $(ClipboardDir)
	chown walter:walter $(ClipboardDir)
	cp index.html $(DeployDir)
	cp clipboardbackend.py $(ClipboardDir)
	cp clipboardbackend.service /etc/systemd/system/
