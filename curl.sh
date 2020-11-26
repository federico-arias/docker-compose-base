#!/bin/bash
eps="offices permissions users users/1/organizations"
for ep in $eps
do
	curl "https://staging.zeroq.cl/admin/api/${ep}" \
		-H "authorization: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIySDV3UUlBVzdhVERkblRmNkZmWDhCTmJoSnQyIiwidXNlciI6eyJuYW1lIjoiSGVydmlzIFBpY2hhcmRvIiwiZW1haWwiOiJocGljaGFyZG9AemVyb3EuY2wiLCJydXQiOiIiLCJpZCI6MTI0MSwidWlkIjoiMkg1d1FJQVc3YVREZG5UZjZGZlg4Qk5iaEp0MiIsInR5cGUiOiJhZG1pbiIsInNsdWciOiJhc2RhIiwiZG5pIjpudWxsfSwidXNlcl9pZCI6MTI0MSwiaWF0IjoxNjA1NjQ3NDEwLCJpc3MiOiJaZXJvUSJ9.dy7kHj5sGsQo34nb57LweqRsmo7jy587kMv-aSqRdUFe0Ua0Hol4N1zx5QmLIyO7L9sfhFYBblP47An4L2d5tw" \
		-H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0' \
		-H 'Accept: application/json, text/plain, */*' \
		-H 'Accept-Language: en-US,en;q=0.5' \
		--compressed \
		-H 'Connection: keep-alive' \
		-o /dev/null \
		--fail
done
