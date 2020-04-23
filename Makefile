test-e2e:
	git config --global user.email "test@example.com"
	git config --global user.name "Test Example"
	cd e2e && \
	git commit -m 'feat: test release' --allow-empty && \
	CI_PULL_REQUEST='' CIRCLE_PULL_REQUEST='' \
	FIREFOX_API_KEY=$(TEST_FIREFOX_API_KEY) \
	FIREFOX_SECRET_KEY=$(TEST_FIREFOX_SECRET_KEY) \
	../node_modules/.bin/semantic-release --branches $(CIRCLE_BRANCH)
	git push --delete origin e2e-v1.0.0
	git tag --delete e2e-v1.0.0

prep-e2e-listed:
	sed -i 's/channel: "unlisted"/channel: "listed"/g' 'e2e/.releaserc.js'

test-e2e-listed: prep-e2e-listed test-e2e
