const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();

    db = client.db("tienda");

    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
  }
}

connectDB();

//! Rutas de la aplicación

app.get("/", (req, res) => {
  res.send("Gestión de Inventario de Tienda en Línea pikachudb");
});

// Añadir un producto
app.post("/productos", async (req, res) => {
  const producto = req.body;
  try {
    const result = await db.collection("productos").insertOne(producto);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obtener todos los productos
app.get("/productos", async (req, res) => {
  try {
    const items = await db.collection("productos").find().toArray();
    res.send(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obtener un producto por su ID
app.get("/productos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await db
      .collection("productos")
      .findOne({ _id: new ObjectId(id) });
    if (producto) {
      res.send(producto);
    } else {
      res.status(404).send({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Actualizar un producto
app.put("/productos/:id", async (req, res) => {
  const id = req.params.id;
  const nuevoProducto = req.body;
  try {
    const result = await db
      .collection("productos")
      .updateOne({ _id: new ObjectId(id) }, { $set: nuevoProducto });
    if (result.matchedCount > 0) {
      res.send({ message: "Producto actualizado exitosamente" });
    } else {
      res.status(404).send({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Eliminar un producto
app.delete("/productos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db
      .collection("productos")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.send({ message: "Producto eliminado exitosamente" });
    } else {
      res.status(404).send({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
