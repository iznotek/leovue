fil:
	cd static/stones/tempspi && \
	tar -cvzf welcome.gz welcome.leo && \
	fossil uv add welcome.gz && \
	fossil uv sync -v \
	rm -f welcome.gz