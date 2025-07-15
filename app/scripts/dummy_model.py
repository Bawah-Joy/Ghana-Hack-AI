from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

X = ["i love this", "i hate this", "amazing", "terrible", "good", "bad"]
y = ["positive", "negative", "positive", "negative", "positive", "negative"]

model = make_pipeline(TfidfVectorizer(), LogisticRegression())
model.fit(X, y)

joblib.dump(model, "model/classifier.pkl")
print("Dummy model saved.")
