IMAGE_NAME = vtex/checkout-ui-healthcheck-$(ENVIRONMENT)

run: build
	docker run --ipc=host -it --shm-size 1024M $(IMAGE_NAME) yarn test:$(ENVIRONMENT)

build: .
	docker build -f ./dockerfiles/$(ENVIRONMENT)/Dockerfile -t $(IMAGE_NAME) --build-arg HORUS_PROXY_KEY --build-arg HORUS_COGNITO_CREDENTIALS .
