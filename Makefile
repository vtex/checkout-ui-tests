IMAGE_NAME = vtex/checkout-ui-healthckeck-$(ENVIRONMENT)

deamon: build
	docker run --ipc=host --shm-size 1024M -d $(IMAGE_NAME)

build: .
	docker build -f ./dockerfiles/$(ENVIRONMENT)/Dockerfile -t $(IMAGE_NAME) --build-arg HORUS_PROXY_KEY --build-arg HORUS_COGNITO_CREDENTIALS .