import React, { FC, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';
import { useForm } from 'react-hook-form';
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { generateSlug } from '../../../utils/generatelSlug';
import { requestApi } from '../../../api';

import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Product } from '../../../models';
import { useRouter } from 'next/router';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    // watch,
  } = useForm<FormData>({
    defaultValues: product,
  });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTagValue, setNewTagValue] = React.useState<string>('');
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const onChangeSize = (size: string) => {
    const currentSizes = getValues('sizes');
    if (currentSizes.includes(size)) {
      return setValue(
        'sizes',
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    }
    setValue('sizes', [...currentSizes, size], { shouldValidate: true });
  };

  const newTag = () => {
    const newTag = newTagValue.trim().toLocaleLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');

    if (currentTags.includes(newTag)) {
      return;
    }
    currentTags.push(newTag);
  };

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter((t) => t !== tag);
    setValue('tags', updatedTags, { shouldValidate: true });
  };

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      for (const file of e.target.files) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await requestApi.post('/admin/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setValue('images', [...getValues('images'), data.message], {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const onDeleteImage = (image: string) => {
    const updatedImages = getValues('images').filter((i) => i !== image);
    setValue('images', updatedImages, { shouldValidate: true });
  };

  const onSubmit = async (formData: FormData) => {
    if (formData.images.length < 2) {
      return alert('Please upload at least 2 images');
    }
    setIsSaving(true);

    try {
      const { data } = await requestApi({
        url: '/admin/products',
        method: formData._id ? 'PUT' : 'POST',
        data: formData,
      });
      // console.log({ data });

      if (!formData._id) {
        router.replace(`/admin/products/${formData.slug}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.log({ error });
      setIsSaving(false);
    }
  };
  return (
    <AdminLayout
      title={'Product'}
      pageDescription={`Product: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={isSaving}
          >
            Save
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Please enter a title',
                minLength: { value: 2, message: 'Min 2 character' },
              })}
              onChange={(e) => {
                setValue('slug', generateSlug(e.target.value));
              }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              variant="filled"
              fullWidth
              multiline
              rows={8}
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Please enter a description',
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Inventory"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Please enter a inventory',
                min: { value: 0, message: 'Min 0' },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Price"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Please enter a price',
                min: { value: 0, message: 'Min 0' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Type</FormLabel>
              <RadioGroup
                row
                value={getValues('type')}
                onChange={(e) =>
                  setValue('type', e.target.value, { shouldValidate: true })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                value={getValues('gender')}
                onChange={(e) =>
                  setValue('gender', e.target.value, { shouldValidate: true })
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Sizes</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox checked={getValues('sizes').includes(size)} />
                  }
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Please enter a description',
                validate: (value) =>
                  value.trim().includes(' ') ? 'No spaces' : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Hang tags"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Press [spacebar] to add"
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              onKeyUp={({ code }) => (code === 'Space' ? newTag() : undefined)}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Update images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg , image/gif"
                style={{ display: 'none' }}
                onChange={onFilesSelected}
              />

              <Chip
                label="It is necessary equipment for 2 pictures"
                color="error"
                variant="outlined"
                sx={{
                  display: getValues('images').length < 2 ? 'flex' : 'none',
                }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color="error"
                          onClick={() => onDeleteImage(img)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  let product: IProduct | null;
  if (slug === 'new') {
    const tempProduct = JSON.parse(JSON.stringify(new Product()));
    delete tempProduct._id;
    tempProduct.images = ['img1.jpg', 'img2.jpg'];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
