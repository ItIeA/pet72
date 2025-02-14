import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPetListingSchema, petTypes } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreatePetListing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | undefined>();

  const form = useForm({
    resolver: zodResolver(insertPetListingSchema),
    defaultValues: {
      petType: petTypes[0],
      breed: "",
      location: "",
      description: "",
      contactInfo: "",
      imageBase64: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/listings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Успешно!",
        description: "Ваше объявление опубликовано.",
      });
      form.reset();
      setPreview(undefined);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Неподдерживаемый формат",
          description: "Пожалуйста, загрузите изображение в формате JPEG, PNG, GIF или WebP",
          variant: "destructive",
        });
        return;
      }

      // Проверяем размер файла (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Ошибка",
          description: "Размер файла не должен превышать 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log("Image loaded, format:", base64.substring(0, 30));
        setPreview(base64);
        form.setValue("imageBase64", base64);
      };
      reader.onerror = () => {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить изображение",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Разместить объявление</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="petType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип питомца</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип питомца" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {petTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порода</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите породу" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Местоположение</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите местоположение" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Опишите питомца" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контактная информация</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите контактную информацию" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Фото питомца</FormLabel>
              <Input
                type="file"
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Предпросмотр"
                    className="max-w-xs rounded-lg"
                    onError={() => {
                      setPreview(undefined);
                      form.setValue("imageBase64", "");
                      toast({
                        title: "Ошибка",
                        description: "Не удалось загрузить изображение",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
              )}
            </div>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Публикация..." : "Опубликовать"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}