import h5py, json
from keras.models import model_from_json

# ---- Step 1: Load config + weights manually ----
with h5py.File("model.h5", "r") as f:
    config = f.attrs.get("model_config")
    if config is not None:
        if isinstance(config, bytes):
            model_json = json.loads(config.decode("utf-8"))
        else:
            model_json = json.loads(config)

        model = model_from_json(json.dumps(model_json))
        model.load_weights("model.h5")

print("✅ Model rebuilt successfully")
model.summary()

# ---- Step 2: Re-save in TF format ----
model.save(r"C:\Users\Dhanush\Desktop\My Codes\Projects\EmoCast\EmotionDetection\model_converted", save_format="tf")
model.save(r"C:\Users\Dhanush\Desktop\My Codes\Projects\EmoCast\EmotionDetection\model_converted.h5")
                 # modern H5 format
print("✅ Model re-saved cleanly!")
